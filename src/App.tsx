import { useState } from 'react';
import type { Item } from './data/levels';
import { actions, bestAccuracy, bestScore, useData } from './lib/store';
import type { Session } from './lib/store';
import { Profiles } from './components/Profiles';
import { Levels } from './components/Levels';
import { Learn } from './components/Learn';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { Parent } from './components/Parent';

type Screen =
  | { name: 'profiles' }
  | { name: 'parent' }
  | { name: 'levels'; kidId: string }
  | { name: 'learn'; kidId: string; levelId: string }
  | { name: 'quiz'; kidId: string; levelId: string; round: number }
  | {
      name: 'results';
      kidId: string;
      levelId: string;
      session: Session;
      missed: Item[];
      prevScore: number | null;
      prevAccuracy: number | null;
    };

export default function App() {
  const data = useData();
  const [screen, setScreen] = useState<Screen>({ name: 'profiles' });

  // If a player was deleted from the parent page, go back to the start.
  if ('kidId' in screen && !data.kids.some((k) => k.id === screen.kidId)) {
    setScreen({ name: 'profiles' });
    return null;
  }

  switch (screen.name) {
    case 'profiles':
      return (
        <Profiles
          onPick={(kidId) => setScreen({ name: 'levels', kidId })}
          onParent={() => setScreen({ name: 'parent' })}
        />
      );
    case 'parent':
      return <Parent onBack={() => setScreen({ name: 'profiles' })} />;
    case 'levels':
      return (
        <Levels
          kidId={screen.kidId}
          onBack={() => setScreen({ name: 'profiles' })}
          onLearn={(levelId) => setScreen({ name: 'learn', kidId: screen.kidId, levelId })}
          onQuiz={(levelId) => setScreen({ name: 'quiz', kidId: screen.kidId, levelId, round: Date.now() })}
        />
      );
    case 'learn':
      return (
        <Learn
          levelId={screen.levelId}
          onBack={() => setScreen({ name: 'levels', kidId: screen.kidId })}
          onQuiz={() => setScreen({ ...screen, name: 'quiz', round: Date.now() })}
        />
      );
    case 'quiz':
      return (
        <Quiz
          key={screen.round}
          kidId={screen.kidId}
          levelId={screen.levelId}
          onQuit={() => setScreen({ name: 'levels', kidId: screen.kidId })}
          onFinish={(session, attempts, missed) => {
            const prevScore = bestScore(data, screen.kidId, screen.levelId);
            const prevAccuracy = bestAccuracy(data, screen.kidId, screen.levelId);
            actions.saveSession(session, attempts);
            setScreen({ name: 'results', kidId: screen.kidId, levelId: screen.levelId, session, missed, prevScore, prevAccuracy });
          }}
        />
      );
    case 'results':
      return (
        <Results
          session={screen.session}
          previousBestScore={screen.prevScore}
          previousBestAccuracy={screen.prevAccuracy}
          missed={screen.missed}
          onAgain={() => setScreen({ name: 'quiz', kidId: screen.kidId, levelId: screen.levelId, round: Date.now() })}
          onLevels={() => setScreen({ name: 'levels', kidId: screen.kidId })}
          onLearn={() => setScreen({ name: 'learn', kidId: screen.kidId, levelId: screen.levelId })}
        />
      );
  }
}
