import { useState } from 'react';
import { SingleValue, MultiValue } from 'react-select';

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

    const extractSelectedValues = (selected: SingleValue<OptionType> | MultiValue<OptionType>): number[] => (
        Array.isArray(selected)
            ? selected.map(option => option.value)
            : selected ? [(selected as OptionType).value] : []
    );

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

        if (name === 'longDestination') {
            const scoreLongDestination = selectedValues.reduce((sum, value) => sum + value, 0);

            setScores(prevScores => {
                const updatedScores = [...prevScores];
                updatedScores[index] += checked ? -scoreLongDestination : scoreLongDestination;
                return updatedScores;
            });
        } else {
            setScores(prevScores => {
                const updatedScores = [...prevScores];
                const previousSelection = previousSelections[index][name] as PreviousSelection;

                if (previousSelection) {
                    const oldValues = extractSelectedValues(previousSelection.selected);
                    const newValues = selectedValues;
                    const addedValues = newValues.filter(value => !oldValues.includes(value));
                    const removedValues = oldValues.filter(value => !newValues.includes(value));

                    const previousScoreRemoved = calculateScore(removedValues, name);
                    const previousScoreAdded = calculateScore(addedValues, name);

                    updatedScores[index] -= previousScoreRemoved;
                    updatedScores[index] += previousScoreAdded;
                } else {
                    const newScore = calculateScore(selectedValues, name);
                    updatedScores[index] += newScore;
                }

                return updatedScores;
            });
        }

        setPreviousSelections(prevSelections => {
            const updatedSelections = [...prevSelections];
            updatedSelections[index] = {
                ...updatedSelections[index],
                [name]: { selected }
            };
            return updatedSelections;
        });
    };

    return {
        scores,
        previousSelections,
        handleSelectChange,
        setScores,
        setPreviousSelections,
    };
};

export default useScoreManager;
