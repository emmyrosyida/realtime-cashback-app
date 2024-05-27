import Counter from './components/Counter'

function App() {
  return (
    <div className="App">
      <div className="text-center text-white relative h-screen bg-[url('../public/bkg-tv.jpg')] bg-cover">
        <div className="fixed p-8 z-10">
          <img
            src="/duck-expo.png"
            className=" w-[120px] rounded-full border-solid border-4 border-white"
            alt="duck-expo"></img>
        </div>
        <Counter />
        <div className="absolute top-0 left-0 w-screen h-screen bg-yellow-600/80"></div>
      </div>
    </div>
  )
}

export default App
