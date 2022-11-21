import React from "react";
import "./App.css";

import { TodoForm } from "./components/Form/TodoForm";
import { CardsDisplay } from "./components/CardsDisplay/CardsDisplay";
import { CardType } from "./components/Card/Card";

import { createStore, createApi, createEffect } from "effector";

const $cardStorage = createStore<CardType[]>([]);

function cardIndexDecorator() {
  let indexCounter = 0;
  return function wrapper() {
    return indexCounter++;
  };
}

let nextCardIndex = cardIndexDecorator();

const api = createApi($cardStorage, {
  add: (state, newCard: CardType) => [
    {
      ...newCard,
      id: nextCardIndex(),
    },
    ...state,
  ],
  delete: (state, id: CardType["id"]) => {
    return [
      ...state.filter((card) => {
        return card.id !== id;
      }),
    ];
  },
  refresh: (state, newCards: CardType[]) => {
    return [...newCards];
  },
  update: (state, updatedCard: CardType) => {
    console.log(
      state.map((card) => {
        if (card.id === updatedCard.id) {
          return updatedCard;
        }
        return card;
      })
    );
    return [
      ...state.map((card) => {
        if (card.id === updatedCard.id) {
          return updatedCard;
        }
        return card;
      }),
    ];
  },
});

function fetchSim(url: string) {
  return new Promise((res, rej) => {
    setTimeout(() => res("completed - " + url), 2000);
  });
}

const fetchSomething = createEffect(async () => {
  return await fetchSim(`https://example.com/users`);
});

// subscribe to handler resolve
fetchSomething.done.watch(({ result, params }) => {
  console.log(params);
  console.log(result);
  nextCardIndex = cardIndexDecorator();
  api.refresh([
    { id: nextCardIndex(), taskstate: "available", title: "1" },
    { id: nextCardIndex(), taskstate: "completed", title: "2" },
    { id: nextCardIndex(), taskstate: "pending", title: "3" },
    { id: nextCardIndex(), taskstate: "completed", title: "4" },
  ]);
});

// subscribe to handler reject or throw error
fetchSomething.fail.watch(({ error, params }) => {
  console.error(params);
  console.error(error);
});

function App() {
  return (
    <div className="App">
      <TodoForm
        onFormSubmit={(card) => {
          api.add(card);
        }}
      />
      <button
        onClick={() => {
          fetchSomething();
        }}
      >
        Симулятор запроса
      </button>
      <CardsDisplay
        $store={$cardStorage}
        onCardDelete={(card) => {
          api.delete(card.id);
        }}
        onCardModify={(updatedCard) => {
          api.update(updatedCard);
        }}
      />
    </div>
  );
}

export default App;
