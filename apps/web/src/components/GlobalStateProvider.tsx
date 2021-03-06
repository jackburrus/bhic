import { createContext, useContext, useMemo, useState } from 'react';

type GlobalStateProviderProps = {
	age: string;
	mood: string;
	gender: string;
	setAge: (age: string) => void;
	setGender: (gender: string) => void;
	setMood: (mood: string) => void;
};
const GlobalStateContext = createContext<GlobalStateProviderProps>(undefined);

export function GlobalStateProvider<GlobalStateProviderProps>({ children }) {
	const [age, setAge] = useState(null);
	const [mood, setMood] = useState(null);
	const [gender, setGender] = useState(null);
	const [image, setImage] = useState();

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
