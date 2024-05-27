import Counter from './components/Counter'

function App() {
  return (
    <div className="App">
      <div className="text-center flex justify-center items-center text-white relative h-screen bg-[url('../public/bkg-tv.jpg')] bg-cover">
        <Counter />
        <div className="absolute top-0 left-0  w-screen h-screen bg-gray-900/60  backdrop-blur-sm bg-blend-color-bur"></div>
      </div>
    </div>
  )
}

export default App
