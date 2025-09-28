import TrackPresenter from './TrackPresenter'
import { styled } from 'styled-components'

const Tracks = styled.div`
  display: flex;
  height: 100dvh;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`

function App() {
  return (
  <Tracks>
    <TrackPresenter toggleKey='w' sliderPosition='right'/>
    <TrackPresenter toggleKey='s' sliderPosition='left'/>
  </Tracks>
  )
}

export default App
