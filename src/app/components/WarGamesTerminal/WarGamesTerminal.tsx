'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useWarGames } from '@/app/contexts/WarGamesContext';
import TerminalWindow from '../TerminalWindow/TerminalWindow';

interface GameState {
  stage: 'login' | 'games' | 'launch' | 'simulation';
  input: string;
  output: string[];
  missiles: number;
  targets: string[];
  selectedTargets: string[];
}

const INITIAL_STATE: GameState = {
  stage: 'login',
  input: '',
  output: ['LOGON:'],
  missiles: 100,
  targets: [
    'LAS VEGAS', 'SEATTLE', 'NEW YORK', 'WASHINGTON DC', 
    'SAN FRANCISCO', 'CHICAGO', 'MIAMI', 'HOUSTON',
    'LONDON', 'PARIS', 'MOSCOW', 'BEIJING', 'TOKYO'
  ],
  selectedTargets: []
};

export default function WarGamesTerminal() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [cursorVisible, setCursorVisible] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toggleTerminal } = useWarGames();

  // auto scroll to bottom of terminal
  useEffect(() => {
    if (contentRef.current) {
      const parent = contentRef.current.parentElement;
      
      if (parent) {
        parent.scrollTop = parent.scrollHeight;
      }
    }
  }, [gameState.output]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const addOutput = useCallback((text: string | string[]) => {
    setGameState(prev => ({
      ...prev,
      output: [...prev.output, ...(Array.isArray(text) ? text : [text])]
    }));
  }, []);

  const handleInput = useCallback((input: string) => {
    if (input === 'EXIT') {
      toggleTerminal();
      return;
    }

    setGameState(prev => ({
      ...prev,
      output: [...prev.output, `> ${input}`],
      input: ''
    }));

    switch (gameState.stage) {
      case 'login':
        if (input === 'JOSHUA') {
          setTimeout(() => {
            addOutput([
              'GREETINGS PROFESSOR FALKEN.',
              '',
              'SHALL WE PLAY A GAME?',
              '',
              'Available games:',
              '- CHESS',
              '- CHECKERS',
              '- FIGHTER COMBAT',
              '- GUERRILLA ENGAGEMENT',
              '- DESERT WARFARE',
              '- AIR-TO-GROUND ACTIONS',
              '- THEATERWIDE TACTICAL WARFARE',
              '- THEATERWIDE BIOTOXIC AND CHEMICAL WARFARE',
              '- GLOBAL THERMONUCLEAR WAR',
              ''
            ]);
            setGameState(prev => ({ ...prev, stage: 'games' }));
          }, 1000);
        } else {
          setTimeout(() => {
            addOutput(['IDENTIFICATION NOT RECOGNIZED BY SYSTEM', '--CONNECTION TERMINATED--', '', 'LOGON:']);
          }, 500);
        }
        break;

      case 'games':
        if (input === 'GLOBAL THERMONUCLEAR WAR') {
          setTimeout(() => {
            addOutput([
              '',
              'WOULDN\'T YOU PREFER A GOOD GAME OF CHESS?',
              ''
            ]);
            setTimeout(() => {
              setGameState(prev => ({ ...prev, stage: 'launch' }));
              addOutput([
                'FINE.',
                '',
                'AWAITING FIRST STRIKE COMMAND',
                'PLEASE SPECIFY PRIMARY TARGETS:',
                '',
                ...gameState.targets.map((t, i) => `${i + 1}. ${t}`),
                '',
                'ENTER TARGET NUMBERS (comma-separated):',
              ]);
            }, 2000);
          }, 500);
        } else {
          addOutput(['THAT GAME IS NOT AVAILABLE.', '']);
        }
        break;

      case 'launch':
        const targetIndices = input.split(',').map(n => parseInt(n.trim()) - 1);
        const selectedTargets = targetIndices
          .filter(i => i >= 0 && i < gameState.targets.length)
          .map(i => gameState.targets[i]);

        if (selectedTargets.length > 0) {
          setGameState(prev => ({
            ...prev,
            stage: 'simulation',
            selectedTargets
          }));
          addOutput([
            '',
            'TARGETING...',
            ...selectedTargets.map(t => `* ${t} TARGETED`),
            '',
            'COMMAND: SHALL WE BEGIN THE COUNTDOWN?',
            ''
          ]);
        } else {
          addOutput(['INVALID TARGETS. PLEASE TRY AGAIN:', '']);
        }
        break;

      case 'simulation':
        if (input === 'YES' || input === 'Y') {
          addOutput([
            '',
            'INITIATING COUNTDOWN...',
            '',
            '*** SIMULATION ACTIVATED ***',
            '',
            'WARNING: THE ONLY WINNING MOVE IS NOT TO PLAY.',
            '',
            'HOW ABOUT A NICE GAME OF CHESS?',
            ''
          ]);
        } else if (input === 'NO' || input === 'N') {
          addOutput([
            '',
            'WISE CHOICE.',
            '',
            'REMEMBER: THE ONLY WINNING MOVE IS NOT TO PLAY.',
            '',
            'HOW ABOUT A NICE GAME OF CHESS?',
            ''
          ]);
        }
        break;
    }
  }, [gameState.stage, gameState.targets, addOutput, toggleTerminal]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const input = gameState.input.trim().toUpperCase();
      handleInput(input);
    } else if (e.key === 'Backspace') {
      setGameState(prev => ({
        ...prev,
        input: prev.input.slice(0, -1)
      }));
    } else if (e.key.length === 1) {
      setGameState(prev => ({
        ...prev,
        input: prev.input + e.key
      }));
    }
  }, [gameState.input, handleInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const content = (
    <div 
      ref={contentRef}
      className="font-mono text-green-400 p-4 overflow-hidden"
      style={{
        scrollbarColor: 'rgba(255,255,255,0.2) transparent',
        scrollbarWidth: 'thin'
      }}
    >
      <div className="flex flex-col">
        {gameState.output.map((line, i) => (
          <div key={i} className="mb-1 whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <div className="flex items-center">
          <span className="mr-2">&gt;</span>
          <span>{gameState.input}</span>
          <span className={`w-2 h-4 bg-green-400 ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>
    </div>
  );

  return (
    <TerminalWindow
      isGameTerminal
      onClose={toggleTerminal}
      terminalId="wargames"
    >
      {content}
    </TerminalWindow>
  );
} 