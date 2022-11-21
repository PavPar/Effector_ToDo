import { Store } from "effector";
import React, { useState } from "react";
import { Card, CardType } from "../Card/Card";
import "./CardsDisplay.css";
import { useStore, useStoreMap } from "effector-react";

export type CardsDisplayType = {
  $store: Store<CardType[]>;
  onCardDelete: (card: CardType) => void;
  onCardModify: (card: CardType) => void;
};

const taskStates: Array<CardType["taskstate"] | "all"> = [
  "available",
  "completed",
  "pending",
  "all",
];

export const CardsDisplay: React.FC<CardsDisplayType> = ({
  $store,
  onCardModify,
  onCardDelete,
}) => {
  const [selectedTaskState, setSelectedTaskState] = useState<
    CardType["taskstate"] | "all"
  >("all");
  const cards =
    useStoreMap({
      store: $store,
      keys: [selectedTaskState],
      fn: (cards, [taskType]) => {
        if (taskType === "all") {
          return cards;
        }
        console.log(cards.filter(({ taskstate }) => taskstate === taskType));
        return cards.filter(({ taskstate }) => taskstate === taskType);
      },
    }) || [];

  return (
    <>
      <select
        value={selectedTaskState}
        onChange={(e) => {
          setSelectedTaskState(e.target.value as CardType["taskstate"]);
        }}
      >
        {taskStates.map((state, idx) => {
          return (
            <option key={idx} value={state}>
              {state}
            </option>
          );
        })}
      </select>
      <div className="carddisplay">
        {cards.map((card, idx) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            onDeleteClick={() => {
              onCardDelete(card);
            }}
            onTaskStateChange={(card) => {
              onCardModify(card);
            }}
            taskstate={card.taskstate}
          />
        ))}
      </div>
    </>
  );
};
