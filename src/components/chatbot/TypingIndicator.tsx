const TypingIndicator = () => {
  return (
    <div className="flex justify-start" role="status" aria-label="Ana está escribiendo">
      <div className="bg-muted p-3 rounded-lg text-sm flex items-center gap-2">
        <div className="flex gap-1">
          <div 
            className="w-2 h-2 bg-primary rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }}
          />
          <div 
            className="w-2 h-2 bg-primary rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }}
          />
          <div 
            className="w-2 h-2 bg-primary rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }}
          />
        </div>
        <span className="text-muted-foreground ml-2">Ana está escribiendo...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
