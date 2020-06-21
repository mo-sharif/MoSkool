/**
 * Single Question is code editor, code preview and error console. This container fetches a single question
 * @param {Object} authUser - Passed from parent container and has everything about the logged in user
 * @param {Object} firebase - Firebase class provides access to authUser and db - comes from withAuthentication hoc
 * @param {Object} history - Provides several different implementations for managing session history in JavaScript in various environments - comes from withRouter and passed to withAuthentication hoc
 * @param {Object} match - Contains information about how a <Route path> matched the URL - comes from withRouter and passed to withAuthentication hoc
 * @param {Object} userRole - User role  object returns an objet of roles with a boolean  flag to indicate if the user has the role or not
 * @returns {<CodeEditor/>} - returns CodeEditor component which renders the rest of the components
 */

import React, { lazy, useCallback, useEffect, useState, Suspense } from "react";

import awardPlayerPoints from "../awardPlayerPoints";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ButtonBase from "@material-ui/core/ButtonBase";
import MoContent from "components/library/MoContent";
import MoSnackbar from "components/library/MoSnackBar";
import MoPage from "components/library/MoPage";
import MoSpinner from "components/library/MoSpinner";
import stringSimilarity from "string-similarity";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { retry } from "utils/retryLazyImports";

const CodeEditor = lazy(() =>
  retry(() => import("components/shared/CodeEditor"))
);
const MoConfetti = lazy(() =>
  retry(() => import("components/library/MoConfetti"))
);

const QuestionPage = ({
  authUser,
  firebase,
  handleOnClick,
  handleNavigation,
  isLoading,
  userRole,
  data,
  match
}) => {
  const [question, setQuestion] = useState(data);
  const [isCorrect, setIsCorrect] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState(null);
  const [matchPercent, setMatchPercent] = useState();

  const useStyles = makeStyles(theme =>
    createStyles({
      buttonArea: {
        textAlign: "left",
        width: "100%",
        "&:hover": {
          background: theme.grey.superLight,
          cursor: "text"
        }
      }
    })
  );

  useEffect(() => {
    setQuestion(data);
  }, [data]);

  const classes = useStyles();
  const triggerNextQuestion = useCallback(() => {
    const id = Number(question.id) + 1;
    /* Clear questions */
    setQuestion({});

    /* Clear matchPercent */
    setMatchPercent();

    setIsCorrect(false);
    handleNavigation(id);
  }, [handleNavigation, question]);

  /* Checks if user code matches Pre made answer */
  const handleOnChange = useCallback(
    ({ userAnswer }) => {
      if (userAnswer === "{}" || userAnswer === "") {
        return;
      }

      const userAnswerTrimmed = userAnswer.replace(/\s/g, "");
      const correctAnswerTrimmed = question.answer.replace(/\s/g, "");
      const cosineSimilarityMatchPercent = stringSimilarity.compareTwoStrings(
        userAnswerTrimmed,
        correctAnswerTrimmed
      );
      setMatchPercent(cosineSimilarityMatchPercent * 100 || 10);
      if (
        // if user answer equals the stored answer in db
        userAnswerTrimmed === correctAnswerTrimmed ||
        // or if user answer is greater than or equal 98% based on jaroWrinker string matching algorithm
        cosineSimilarityMatchPercent * 100 >=
          (question?.matchPercent * 100 || 100)
      ) {
        setQuestion({ ...question, isCorrect: true, question: userAnswer });
        /* Awards users a point based on level completion */

        awardPlayerPoints(
          authUser,
          firebase,
          question.id,
          match.params.collection
        );
        setIsCorrect(true);
        setSnackbarProps({
          title: "Hooray!",
          buttonText: "Keep Going",
          buttonIcon: <ArrowForwardIcon />
        });
      } else {
        setQuestion({ ...question, question: userAnswer });
      }
    },
    [authUser, firebase, match, question]
  );
  return (
    <Suspense fallback={<MoSpinner isLoading={true} color="primary" />}>
      <MoConfetti isActive={isCorrect} />
      <ButtonBase
        className={classes.buttonArea}
        onClick={() => handleOnClick()}
        disabled={!userRole.isAdmin}
      >
        <MoPage
          isAdmin={userRole.isAdmin}
          title={question?.title}
          subtitle={question?.label}
          hint={question?.subtitle}
          isLoading={isLoading}
          isCard={false}
        />
      </ButtonBase>
      {question?.content && <MoContent content={question.content} />}
      {question && (
        <CodeEditor
          handleOnChange={userAnswer => handleOnChange(userAnswer)}
          question={question}
          matchPercent={matchPercent}
          sm={6}
          md={6}
        />
      )}
      {snackbarProps && (
        <MoSnackbar
          isActive={isCorrect}
          authUser={authUser}
          snackbarProps={snackbarProps}
          triggerNextQuestion={() => triggerNextQuestion()}
        />
      )}
    </Suspense>
  );
};
export default QuestionPage;