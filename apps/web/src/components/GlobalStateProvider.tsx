import { createContext, useContext, useMemo, useState } from 'react';

type GlobalStateProviderProps = {
	age: string;
};
const GlobalStateContext = createContext<GlobalStateProviderProps>(undefined);

export function GlobalStateProvider<GlobalStateProviderProps>({ children }) {
	const [age, setAge] = useState('30');
	const [mood, setMood] = useState(null);
	const [gender, setGender] = useState(null);

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
