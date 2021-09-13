import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useModalToggle, useModalData } from "../../contexts/ModalContext";
import { EGGVG } from "../Egg/constants";

export default function ExportReceipt() {
	const [egg, setEgg] = useState<any>(null)
	const { toggleModal, open } = useModalToggle();
	const { data: { name, description } } = useModalData();
	useEffect(() => {
		if (open) {
			const egg: any = document.getElementById(EGGVG)?.cloneNode(true)
			egg.style.display = ""
			const clipPath = egg.getElementById("clip-path")!
			clipPath.id = "clip-path-export"
			const g = egg.querySelectorAll("#SVG > g")[0]!
			g.setAttribute("clip-path", "url(#clip-path-export)")
			const html = egg.outerHTML
			const container = document.querySelector(".egg-container")
			container!.innerHTML = html
		}
	}, [open])
	return (
		<div>
			<div className="modal__title">Your Beautiful Egg</div>
			<div className="modal__block">
				<div>{name}</div>
				<div>{description}</div>
				<div className="egg-container" style={{ width: "100%" }} />
			</div>
			<div className="modal__button-container">
				<Button name="Ok" onClick={toggleModal} />
			</div>
		</div>
	);
}
