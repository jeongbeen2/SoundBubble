import React from "react";
import styled from "styled-components";
import Note from "./Note";
import { NoteType } from "./helpers";

const Wrapper = styled.div`
	div {
		width: 440px;
	}
	@media only screen and (max-width: 768px) {
		div {
			width: 320px;
		}
	}
`;

type Props = {
	notes: NoteType[];
	clickHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const Octave: React.FC<Props> = ({ notes, clickHandler }) => (
	<Wrapper>
		<div>
			{notes.map((element: any) => (
				<Note key={element.note} color={element.color} note={element.note} onClick={clickHandler} />
			))}
		</div>
	</Wrapper>
);

export default Octave;
