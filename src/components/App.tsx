import { Toaster } from 'react-hot-toast';
import Game from '@/components/Game';
import '@/styles/App.css';

const App: React.FC = () => {
  return (
    <>
    {/* Using toaster for nicer feedback for the player */}
    <Toaster
      containerStyle={{
        top: 45,
        left: 20,
        bottom: 20,
        right: 20,
        fontSize: '14px',
        textAlign: 'center'
      }}
    />
    {/* The actual game component */}
    <Game/>
    </>
  )
}

export default App
