import { useCallback, useState } from 'react';
import { SingleValue, MultiValue } from 'react-select';
import ScoreCard from '../components/scoreCard';

interface OptionType {
    value: number;
    label: string;
}

interface PreviousSelection {
    selected: SingleValue<OptionType> | MultiValue<OptionType>;
}

const useScoreManager = (playerNumber: number) => {
    const [scores, setScores] = useState<number[]>(Array(playerNumber).fill(0));
    const [previousSelections, setPreviousSelections] = useState<{ [key: string]: PreviousSelection }[]>(Array(playerNumber).fill({}));

    const extractSelectedValues = (selected: SingleValue<OptionType> | MultiValue<OptionType>): number[] => {
        if (Array.isArray(selected)) {
            return selected.map(option => option.value);
        } else if (selected && 'value' in selected) {
            return [selected.value];
        }
        return [];
    };

    const calculateScore = (values: number[], name?: string): number => {
        let score = 0;
        switch (name) {
            case 'longDestination':
                score = values.reduce((sum, value) => sum + value, 0);
                break;
            case 'destinationCompleted':
                score = values.reduce((sum, value) => sum + value, 0);
                break;
            case 'destinationFailed':
                score = values.reduce((sum, value) => sum - value, 0);
                break;
            case 'trainStations':
                score = values.reduce((sum, value) => sum - (value * 4), 0);
                break;
            case 'roads':
                score = values.reduce((sum, value) => sum + value, 0);
                break;
            default:
                score = 0;
                break;
        }
        return score;
    };

    const handleSelectChange = (index: number) => (
        selected: SingleValue<OptionType> | MultiValue<OptionType>,
        name?: string,
        checked?: boolean
    ) => {
        if (typeof name !== 'string') return;

        const selectedValues = extractSelectedValues(selected);

        setScores(prevScores => {
            const updatedScores = [...prevScores];
            const previousSelection = previousSelections[index][name] as PreviousSelection;


            if (previousSelection) {
                const oldValues = extractSelectedValues(previousSelection.selected);
                const removedValues = oldValues.filter(value => !selectedValues.includes(value));
                const addedValues = selectedValues.filter(value => !oldValues.includes(value));
                if (!checked) {
                    updatedScores[index] -= calculateScore(removedValues, name);
                }
                updatedScores[index] += calculateScore(addedValues, name);
            } else {
                updatedScores[index] += calculateScore(selectedValues, name);
            }


            return updatedScores;
        });

        setPreviousSelections(prevSelections => {
            const updatedSelections = [...prevSelections];
            updatedSelections[index] = {
                ...updatedSelections[index],
                [name]: { selected }
            };
            return updatedSelections;
        });
    };

    const handleCheckboxChange = (index: number) => (
        selected: SingleValue<OptionType> | MultiValue<OptionType>,
        checked?: boolean
    ) => {
        const selectedValues = extractSelectedValues(selected);
        console.log(selectedValues);
        setScores(prevScores => {
            const updatedScores = [...prevScores];
            const scoreLongDestination = selectedValues.reduce((sum, value) => sum + value, 0);
            updatedScores[index] += checked ? -scoreLongDestination : scoreLongDestination;
            return updatedScores;
        });
    };

    const resetSelections = useCallback(() => {
        setPreviousSelections(Array(playerNumber).fill({}));
        setScores(Array(playerNumber).fill(0));
    }, [playerNumber]);

    return {
        scores,
        previousSelections,
        handleSelectChange,
        handleCheckboxChange,
        resetSelections
    };
};

export default useScoreManager;