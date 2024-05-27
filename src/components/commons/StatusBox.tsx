const StatusBox = ({ color, text }: { color: string; text: string }) => {
  return (
    <span
      className={`text-xs font-bold inline-flex items-center px-2.5 py-0.5 rounded mr-2 border
            ${color}`}>
      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3 mr-1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
        />
      </svg>
      <span className="pt-1"> {text}</span>
    </span>
  )
}

export default StatusBox
