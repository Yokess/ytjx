import React, { useEffect, useRef } from 'react';

interface HighlightTextProps {
  text: string;
  html?: boolean;
  className?: string;
  customStyle?: boolean; // 是否使用自定义样式覆盖后端样式
}

const HighlightText: React.FC<HighlightTextProps> = ({ 
  text, 
  html = false, 
  className = '',
  customStyle = false
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (html && customStyle && contentRef.current) {
      // 替换高亮标签的样式为蓝色
      const content = contentRef.current;
      const highlightElements = content.querySelectorAll('em[style*="color:red"]');
      highlightElements.forEach(el => {
        (el as HTMLElement).style.color = 'blue';
      });
    }
  }, [text, html, customStyle]);
  
  if (!text) return null;
  
  if (html) {
    return (
      <div 
        ref={contentRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: text }} 
      />
    );
  }
  
  return <span className={className}>{text}</span>;
};

export default HighlightText; 