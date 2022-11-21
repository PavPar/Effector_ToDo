import React, { useState } from "react";
import "./Card.css";

export type CardType = {
  id: number;
  title: string;
  taskstate: "available" | "pending" | "completed";
  onDeleteClick?: () => void;
  onTaskStateChange?: (card: CardType) => void;
};

function replaceEmptyTitle(title: CardType["title"]) {
  return title.length === 0 ? "<Без заголовка>" : title;
}

const taskStates: Array<CardType["taskstate"]> = [
  "available",
  "completed",
  "pending",
];

export const Card: React.FC<CardType> = ({
  id,
  title,
  taskstate,
  onDeleteClick,
  onTaskStateChange,
}: CardType) => {
  const [selectedTaskState, setSelectedTaskState] = useState(taskstate);

  return (
    <div className={`card`}>
      <h2 className="card__title">{replaceEmptyTitle(title)}</h2>

      <button
        className="card__button"
        type="button"
        onClick={() => onDeleteClick && onDeleteClick()}
      >
        {`Удалить ${id}`}
      </button>
      <select
        value={selectedTaskState}
        onChange={(e) => {
          onTaskStateChange &&
            onTaskStateChange({
              id,
              taskstate: e.target.value as CardType["taskstate"],
              title,
            });
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
    </div>
  );
};
