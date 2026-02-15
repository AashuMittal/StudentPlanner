import addition from "../asset/Addition.webp";
import Read from "../asset/book.webp";
import entertainment from "../asset/entertainment.webp";
import Experiment from "../asset/experiment.webp";
import grocery from "../asset/Grocery.webp";
import lecture from "../asset/lecture.webp";
import Note from "../asset/notes.webp";
import tick from "../asset/right_tick.webp";
import transport from "../asset/transport.webp";

/* Login Illustration (online image) */
export function LoginImg() {
  return (
    <img
      src="https://img.freepik.com/free-vector/students-learning-online-illustration_74855-5293.jpg"
      alt="Login"
      className="w-full max-w-sm mx-auto mb-6"
    />
  );
}

/* Dashboard Images */
export function GroceryImg() {
  return <img src={grocery} alt="Grocery" className="h-20 w-20" />;
}

export function TransportImg() {
  return <img src={transport} alt="Transport" className="h-20 w-20" />;
}

export function EntertainmentImg() {
  return <img src={entertainment} alt="Entertainment" className="h-20 w-20" />;
}

export function TickImg() {
  return <img src={tick} alt="Done" className="h-7 w-8" />;
}

export function AdditionImg() {
  return <img src={addition} alt="Add" className="h-10" />;
}

export function LectureImg() {
  return <img src={lecture} alt="Lecture" className="h-10" />;
}

export function ReadImg() {
  return <img src={Read} alt="Lecture" className="h-10" />;
}

export function NotesImg() {
  return <img src={Note} alt="Lecture" className="h-10" />;
}

export function ExperimentsImg() {
  return <img src={Experiment} alt="Lecture" className="h-10" />;
}