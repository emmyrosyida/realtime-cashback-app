const TitleText = ({ main, sub }: { main: string; sub?: string }) => {
  return (
    <>
      <h1 className="text-4xl mb-3">{main}</h1>
      <h1 className="text-7xl">{sub}</h1>
    </>
  )
}
export default TitleText
