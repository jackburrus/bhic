import { createContext, useContext, useMemo, useState } from 'react';

type GlobalStateProviderProps = {
	age: string;
	setAge: () => void;
	setMood: () => void;
	setGender: () => void;
	mood: string;
	gender: string;
	image: string;
	setImage: () => void;
};
const GlobalStateContext = createContext<GlobalStateProviderProps>(undefined);

export function GlobalStateProvider<GlobalStateProviderProps>({ children }) {
	const [age, setAge] = useState(null);
	const [mood, setMood] = useState(null);
	const [gender, setGender] = useState(null);
	const [image, setImage] = useState(null);

	const contextValue = useMemo(
		() => ({
			age,
			setAge,
			mood,
			setMood,
			gender,
			setGender,
		}),
		[age, setAge, mood, setMood, gender, setGender],
	);
	return <GlobalStateContext.Provider value={contextValue}>{children}</GlobalStateContext.Provider>;
}

export const useGlobalStateContext = () => {
	const value = useContext(GlobalStateContext);

	if (!value) {
		throw new Error('Missing ExhibitionsProvider higher in the tree');
	}

	return value;
};
