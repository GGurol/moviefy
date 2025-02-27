// import { useEffect, useRef, useState } from "react";
// import { AiOutlineClose } from "react-icons/ai";
// import { Input } from "./ui/input";

// function TagsInput({ value, name, onChange }) {
//   const [tag, setTag] = useState("");
//   const [tags, setTags] = useState([]);

//   const inputRef = useRef();
//   const tagsInputRef = useRef();

//   const handleOnChange = ({ target }) => {
//     const { value } = target;
//     if (value !== ",") setTag(value);

//     onChange(tags);
//   };

//   const handleKeyDown = ({ key }) => {
//     if (key === "," || key === "Enter") {
//       if (!tag) return;

//       if (tags.includes(tag)) return setTag("");

//       setTags([...tags, tag]);
//       setTag("");
//     }

//     if (key === "Backspace" && !tag && tags.length) {
//       const newTags = tags.filter((_, index) => index !== tags.length - 1);
//       setTags([...newTags]);
//     }
//   };

//   const removeTag = (tagToRemove) => {
//     const newTags = tags.filter((tag) => tag !== tagToRemove);
//     setTags([...newTags]);
//   };

//   const handleOnFocus = () => {
//     tagsInputRef.current.classList.remove(
//       "dark:border-dark-subtle",
//       "border-light-subtle"
//     );
//     tagsInputRef.current.classList.add("dark:border-white", "border-primary");
//   };

//   const handleOnBlur = () => {
//     tagsInputRef.current.classList.add(
//       "dark:border-dark-subtle",
//       "border-light-subtle"
//     );
//     tagsInputRef.current.classList.remove(
//       "dark:border-white",
//       "border-primary"
//     );
//   };

//   useEffect(() => {
//     if (value.length) setTags(value);
//   }, [value]);

//   useEffect(() => {
//     // javascript scroll into view  https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
//     inputRef.current?.scrollIntoView(false);
//   }, [tag]);

//   return (
//     // <div>
//     <div
//       ref={tagsInputRef}
//       onKeyDown={handleKeyDown}
//       className="border bg-transparent dark:border-dark-subtle border-light-subtle px-2 h-10 rounded w-full text-white flex items-center space-x-2 overflow-x-auto custom-scroll-bar transition"
//       // className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
//     >
//       {tags.map((t) => (
//         <Tag onClick={() => removeTag(t)} key={t}>
//           {t}
//         </Tag>
//       ))}
//       <input
//         id={name}
//         ref={inputRef}
//         type="text"
//         className="h-full flex-grow bg-transparent outline-none dark:text-white text-primary"
//         // placeholder="Tag one, Tag two"
//         value={tag}
//         onChange={handleOnChange}
//         onFocus={handleOnFocus}
//         onBlur={handleOnBlur}
//       />
//     </div>
//     // </div>
//   );
// }

// const Tag = ({ children, onClick }) => {
//   return (
//     <span className=" dark:text-primary text-white flex items-center text-sm px-1 whitespace-nowrap">
//       {children}
//       {/* <AiOutlineClose size={12} onClick={onClick} /> */}
//       <button type="button" onClick={onClick}>
//         <AiOutlineClose size={12} />
//       </button>
//     </span>
//   );
// };

// export default TagsInput;
