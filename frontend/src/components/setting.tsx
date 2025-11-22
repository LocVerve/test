import React from 'react';
import styled from 'styled-components';

interface AvatarButtonProps {
  avatarUrl?: string;
  onClick?: () => void;
  className?: string;
}

const AvatarButton: React.FC<AvatarButtonProps> = ({ avatarUrl, onClick, className }) => {
  return (
    <StyledWrapper className={className}>
      <button className="avatar-button" onClick={onClick}>
        <div className="avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="用户头像" />
          ) : (
            <div className="avatar-placeholder">
              <i className="fa-solid fa-user"></i>
            </div>
          )}
        </div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .avatar-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    border-radius: 50%;
    transition: all 0.2s ease;
    position: relative;
  }

  .avatar-button:hover {
    transform: scale(1.05);
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    color: #666;
  }
  
  .avatar-placeholder i {
    font-size: 20px;
  }
`;

export default AvatarButton;
