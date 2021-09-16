
const TagText = ({ children, fontSize = "2rem", padding = 5 }: { children: JSX.Element | string, fontSize?: string | number, padding?: number | string }) =>
	<div style={{ background: "black", color: "white", padding, fontSize }}>{children}</div>
export default TagText;