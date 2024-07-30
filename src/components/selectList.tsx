import { useState } from 'react';
import Select, { MultiValue } from "react-select";
import { SingleValue } from 'react-select';
import { DestinationData } from '../models/destination';

// Définir le type pour les options
interface OptionType {
    value: number;
    label: string;
}

// Définir les propriétés du composant
interface SelectListProps {
    defaultOption: string;
    selectMultiple?: boolean;
    options?: OptionType[];
}

const SelectList: React.FC<SelectListProps> = ({ defaultOption, selectMultiple, options }) => {

    const [selectedOption, setSelectedOption] = useState<SingleValue<OptionType> | MultiValue<OptionType>>(selectMultiple ? [] : null);

    // Fonction de gestion du changement de sélection
    const handleChange = (selected: SingleValue<OptionType> | MultiValue<OptionType>) => {
        setSelectedOption(selected);
    };


    return (
        <div className="p-4">
            {selectMultiple ? (
                // Rendu pour sélection multiple
                <Select
                    value={selectedOption as MultiValue<OptionType>}
                    onChange={handleChange}
                    options={options}
                    isMulti
                    placeholder={`Select ${defaultOption}`}
                />
            ) : (
                // Rendu pour sélection unique
                <Select
                    value={selectedOption as SingleValue<OptionType>}
                    onChange={handleChange}
                    options={options}
                    placeholder={`Select ${defaultOption}`}
                />
            )}
        </div>
    );
};

export default SelectList;
