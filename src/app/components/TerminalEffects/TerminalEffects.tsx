import Glow from './Glow';
import Scanlines from './Scanlines';
import Flicker from './Flicker';

export default function TerminalEffects() {
  return (
    <>
      <Scanlines />
      <Glow />
      <Flicker />
    </>
  );
}
