interface SceneHelpersProps {
  gridSize: number;
  axesSize: number;
}

export default function SceneHelpers({ gridSize, axesSize }: SceneHelpersProps) {
  return (
    <>
      <gridHelper args={[gridSize, gridSize]} />
      <axesHelper args={[axesSize]} />
    </>
  );
}
