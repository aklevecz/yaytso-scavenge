type Props = {
  color: string;
};

export default function LoadingButton({ color }: Props) {
  console.log("render");
  return (
    <button className="btn" style={{ background: "black" }}>
      {/* <div className="dot-elastic"></div> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="dot-typing"></div>
      </div>
    </button>
  );
}
