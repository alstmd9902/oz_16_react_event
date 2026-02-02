const INPUT_BASE_CLASS = `w-full rounded-md border border-neutral-700 bg-neutral-800 
px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600`;

export default function InputField({
  value,
  name,
  type = "text",
  placeholder,
  hideLabel
}) {
  return (
    <>
      <label
        htmlFor={name}
        className={
          hideLabel ? "sr-only" : "text-shadow-amber-50 pl-1 pb-1 text-xs"
        }
      ></label>
      <input
        id={name}
        value={value}
        name={name}
        type={type}
        placeholder={placeholder}
        className={INPUT_BASE_CLASS}
      />
    </>
  );
}
