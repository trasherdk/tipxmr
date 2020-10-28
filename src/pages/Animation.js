import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useTransition, animated } from "react-spring";
import { useRecoilValue } from "recoil";
import { streamerState } from "~/store/atom";
import {
  emitGetAnimationConfig,
  onGetAnimationConfig,
} from "~/libs/socket_animation";
import clsx from "clsx";

function GoalBar({ goalProgress, goal }) {
  const percentage = (goalProgress / goal) * 100;
  const percentageString = percentage + "%";
  const barStyle = clsx([
    "bg-xmrorange",
    "text-xs",
    "leading-none",
    "py-1",
    "text-center",
    "text-white",
  ]);
  console.log("percentage: ", percentageString);
  return (
    <div className="mt-3">
      <div className="w-full">
        <div className="shadow-lg w-full bg-gray-700">
          <div className={barStyle} style={{ width: percentageString }}>
            {(goalProgress / goal) * 100}%
          </div>
          {console.log(goalProgress)}
        </div>
      </div>
      <p className="text-xl">
        Goal: {goalProgress}/{goal} XMR
      </p>
    </div>
  );
}

function Sound({ sound }) {
  return <audio src={sound} autoPlay={true}></audio>;
}

function Animation() {
  const { userName } = useParams();
  const [animationConfig, setAnimationConfig] = useState();
  const [time, setTime] = useState(0);
  const [fontColor, setFontColor] = useState(null);
  const [showGoal, setShowGoal] = useState(false);
  const [goalProgress, setGoalProgress] = useState(0);
  const [sound, setSound] = useState(null);
  const [goal, setGoal] = useState(0);

  const [donor, setDonor] = useState("Happy Tipper");
  const [amount, setAmount] = useState(2);
  const [message, setMessage] = useState("Testing things out");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    emitGetAnimationConfig(userName);
    onGetAnimationConfig(setAnimationConfig);
  }, [userName]);

  useEffect(() => {
    if (animationConfig) {
      setTime(1000 / animationConfig.secondPrice);
      setFontColor(animationConfig.fontColor);
      setShowGoal(animationConfig.showGoal);
      setGoalProgress(animationConfig.goalProgress);
      setSound(animationConfig.sound);
      setGoal(animationConfig.goal);
      setTimeout(() => {
        setGoalProgress((prevState) => prevState + amount);
      }, 2000);
    }
  }, [animationConfig]);

  // const streamerConfig = useRecoilValue(streamerState);
  // console.log("Animation streamer config: ", streamerConfig);

  const messageTransitions = useTransition(showMessage, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  function dismountMessage() {
    setTimeout(() => setShowMessage(false), time * amount);
  }

  // TODO create a template for the most basic donation
  // TODO implement the goal, show only if the config says so

  return (
    <div
      className="flex flex-grow justify-center bg-opacity-0"
      onClick={() => {
        setShowMessage(!showMessage);
        dismountMessage();
      }}
    >
      <div className="my-auto text-4xl text-center">
        {messageTransitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div key={key} style={props}>
                {sound ? <Sound sound={sound} /> : ""}
                <p>
                  {donor} donated {amount} XMR
                </p>
                <p>{message}</p>
                {showGoal ? (
                  <GoalBar goalProgress={goalProgress} goal={goal} />
                ) : (
                  ""
                )}
              </animated.div>
            )
        )}
      </div>
    </div>
  );
}

Animation.propTypes = {
  streamerConfig: PropTypes.object,
};

export default Animation;
