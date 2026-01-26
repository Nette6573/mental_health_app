export default function EmotionPicker({ emotions, selectedEmotions, onEmotionToggle }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {emotions.map(emotion => (
        <button
          key={emotion.id}
          type="button"
          onClick={() => onEmotionToggle(emotion.id)}
          className={`
            flex flex-col items-center p-2 rounded-lg border transition-all duration-200
            ${selectedEmotions.includes(emotion.id)
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
            }
          `}
        >
          <span className="text-lg mb-1">{emotion.emoji}</span>
          <span className="text-xs">{emotion.label}</span>
        </button>
      ))}
    </div>
  )
}