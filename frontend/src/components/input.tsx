import React from 'react';
import styled from 'styled-components';

const Input = ({
value = "",
onChange = () => {},
placeholder = "请搜索问题...",
type = "text"
}:{
value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) => {
  return (
    <StyledWrapper>
      <div className="ask-ai-wrapper">
        <div className="ai-input-container">
          <span className="underline-effect" />
          <span className="ripple-circle" />
          <span className="bg-fade" />
          <span className="floating-dots">
            <span />
            <span />
            <span />
            <span />
          </span>
          <input placeholder={placeholder} 
            className="ai-input" 
            type={type}
            value={value}
            onChange={onChange}/>
          <span className="icon-container">
           <i className="fa-solid fa-search text-gray-400"></i>
          </span>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .ask-ai-wrapper {
    display: inline-block;
    width: 280px; /* Adjustable width */
    position: relative;
  }

  .ask-ai-wrapper .ai-input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 2px solid #4a4a4a;
    border-radius: 12px;
    padding: 10px 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.5s cubic-bezier(0.65, 0, 0.35, 1);
    overflow: hidden;
  }

  /* Input field */
  .ask-ai-wrapper .ai-input {
    flex-grow: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: sans-serif;
    font-size: 1rem;
    color: #333;
    padding: 6px 10px;
    width: 100%;
    position: relative; /* Ensure it stays above other elements */
    z-index: 2; /* Bring input to the front */
    transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ask-ai-wrapper .ai-input::placeholder {
    color: #888;
    font-style: italic;
  }

  /* SVG container */
  .ask-ai-wrapper .icon-container {
    position: relative;
    width: 24px;
    height: 24px;
    transition: all 0.5s cubic-bezier(0.7, -0.5, 0.3, 1.5);
    cursor: pointer;
    z-index: 2; /* Ensure SVG is clickable */
  }

  /* SVG animation */
  .ask-ai-wrapper .ai-icon path {
    fill: #4a4a4a;
    transform-origin: center;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Subtle underline effect */
  .ask-ai-wrapper .underline-effect {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background:rgba(49, 110, 180, 0.38);
    transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 1;
  }

  /* Ripple circle */
  .ask-ai-wrapper .ripple-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(39, 80, 163, 0.49);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
  }

  /* Floating dots */
  .ask-ai-wrapper .floating-dots {
    position: absolute;
    inset: 0;
    pointer-events: none; /* Prevent dots from blocking input */
    z-index: 1; /* Below input but above background */
  }

  .ask-ai-wrapper .floating-dots span {
    position: absolute;
    width: 3px;
    height: 3px;
    background: rgba(26, 72, 128, 0.81);
    border-radius: 50%;
    opacity: 0;
    transition:
      opacity 0.3s ease,
      transform 0.6s cubic-bezier(0.7, -0.5, 0.3, 1.5);
  }

  /* Background fade */
  .ask-ai-wrapper .bg-fade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 107, 107, 0.05),
      rgba(255, 235, 235, 0.1)
    );
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 0;
  }

  /* Hover and focus states */
  .ask-ai-wrapper .ai-input-container:hover,
  .ask-ai-wrapper .ai-input:focus-within .ai-input-container {
    border-color:rgba(29, 70, 132, 1);
    box-shadow: 0 6px 20px rgba(50, 76, 190, 0.82);
    transform: translateY(-4px);
  }

  .ask-ai-wrapper .ai-input-container:hover .icon-container,
  .ask-ai-wrapper .ai-input:focus-within .icon-container {
    transform: translateY(-2px) scale(1.1);
  }

  .ask-ai-wrapper .ai-input-container:hover .ai-icon path,
  .ask-ai-wrapper .ai-input:focus-within .ai-icon path {
    fill: rgba(17, 193, 167, 1);
    transform: scale(1.1) rotate(5deg);
    animation: gentleBounce 0.5s infinite alternate
      cubic-bezier(0.7, -0.5, 0.3, 1.5);
  }

  .ask-ai-wrapper .ai-input-container:hover .underline-effect,
  .ask-ai-wrapper .ai-input:focus-within .underline-effect {
    width: 100%;
  }

  .ask-ai-wrapper .ai-input-container:hover .ripple-circle,
  .ask-ai-wrapper .ai-input:focus-within .ripple-circle {
    width: 200px;
    height: 200px;
  }

  .ask-ai-wrapper .ai-input-container:hover .floating-dots span,
  .ask-ai-wrapper .ai-input:focus-within .floating-dots span {
    opacity: 1;
    animation: floatUp 1.2s infinite cubic-bezier(0.65, 0, 0.35, 1);
  }

  .ask-ai-wrapper .ai-input-container:hover .bg-fade,
  .ask-ai-wrapper .ai-input:focus-within .bg-fade {
    opacity: 1;
  }

  /* Focus state for input */
  .ask-ai-wrapper .ai-input:focus {
    color: rgba(49, 63, 103, 1);
  }

  /* Animations */
  @keyframes gentleBounce {
    0% {
      transform: scale(1.1) translateY(1px);
    }
    100% {
      transform: scale(1.1) translateY(-1px);
    }
  }

  @keyframes floatUp {
    0% {
      transform: translate(var(--x), var(--y)) scale(1);
      opacity: 0;
    }
    50% {
      transform: translate(var(--x), calc(var(--y) - 15px)) scale(1.3);
      opacity: 1;
    }
    100% {
      transform: translate(var(--x), calc(var(--y) - 30px)) scale(1);
      opacity: 0;
    }
  }

  /* Dot positions */
  .ask-ai-wrapper .floating-dots span:nth-child(1) {
    --x: 10px;
    --y: 10px;
    animation-delay: 0s;
  }
  .ask-ai-wrapper .floating-dots span:nth-child(2) {
    --x: -5px;
    --y: 5px;
    animation-delay: 0.2s;
  }
  .ask-ai-wrapper .floating-dots span:nth-child(3) {
    --x: 15px;
    --y: 0px;
    animation-delay: 0.4s;
  }
  .ask-ai-wrapper .floating-dots span:nth-child(4) {
    --x: -10px;
    --y: 15px;
    animation-delay: 0.6s;
  }`;

export default Input;
