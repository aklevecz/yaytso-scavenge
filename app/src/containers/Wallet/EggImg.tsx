import { useState } from "react";
import DotTyping from "../../components/Loading/DotTyping";
import { ipfsLink } from "../../utils";

export default function EggImg({ cid }: { cid: string }) {
	const [loaded, setLoaded] = useState(false)
	return (
		<>
			{!loaded && <div className="loading-dot__jank-container">
				<div className="dot-typing-inverse"></div></div>}
			<img src={ipfsLink(cid)} onLoad={() => setLoaded(true)} style={{ display: loaded ? "block" : "none" }} />
		</>
	)
}