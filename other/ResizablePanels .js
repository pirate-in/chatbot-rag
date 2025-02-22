import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Styled components
const Container = styled(Box)({
  display: 'flex',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
});

const Panel = styled(Paper)({
  height: '100%',
  backgroundColor: '#f5f5f5',
});

const Resizer = styled(Box)(({ theme }) => ({
  width: '4px',
  backgroundColor: theme.palette.divider,
  position: 'relative',
  cursor: 'col-resize',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
  '&.resizing': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const CollapseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    backgroundColor: theme.palette.background.default,
  },
  zIndex: 1,
}));

const ResizablePanels = () => {
  const [isResizing, setIsResizing] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(0); // Start collapsed
  const [lastWidth, setLastWidth] = useState(300); // Store last width for expand
  const containerRef = useRef(null);
  const minWidth = 200;
  const maxWidth = 800;

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleCollapse = () => {
    if (rightPanelWidth > 0) {
      setLastWidth(rightPanelWidth);
      setRightPanelWidth(0);
    }
  };

  const handleExpand = () => {
    if (rightPanelWidth === 0) {
      setRightPanelWidth(lastWidth);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      
      let newWidth = containerWidth - mouseX;
      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
      newWidth = Math.min(newWidth, containerWidth - minWidth);
      
      setRightPanelWidth(newWidth);
      setLastWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <Container ref={containerRef}>
      {/* Left Panel */}
      <Panel
        elevation={0}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        <Box p={2}>
          <h2>Left Panel</h2>
          <p>This panel will adjust its size automatically</p>
        </Box>
      </Panel>

      {/* Resizer with Collapse/Expand Button */}
      <Resizer className={isResizing ? 'resizing' : ''} onMouseDown={handleMouseDown}>
        <CollapseButton
          size="small"
          onClick={rightPanelWidth > 0 ? handleCollapse : handleExpand}
        >
          {rightPanelWidth > 0 ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </CollapseButton>
      </Resizer>

      {/* Right Panel */}
      <Panel
        elevation={0}
        sx={{
          width: rightPanelWidth,
          transition: 'width 0.3s ease',
          overflow: 'auto',
        }}
      >
        <Box p={2}>
          <h2>Right Panel</h2>
          <p>This panel starts collapsed and can be resized</p>
        </Box>
      </Panel>
    </Container>
  );
};

export default ResizablePanels;