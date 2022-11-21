import React, { useState } from "react";
import { CardType } from "../Card/Card";
import "./TodoForm.css";

export interface TodoFormInterface {
  onFormSubmit: (card: CardType) => void;
}

export const TodoForm: React.FC<TodoFormInterface> = ({ onFormSubmit }) => {
  const [title, setTitle] = useState<string>("");
  return (
    <form
      className="todoform"
      onSubmit={(e) => {
        e.preventDefault();
        onFormSubmit({
          id: 0,
          title: title,
          taskstate: "available",
        });
      }}
    >
      <input
        className="todoform__textarea"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value || "");
        }}
      ></input>
      <button className="todoform__button todoform__button_type-submit">
        Добавить задачу
      </button>
    </form>
  );
};
