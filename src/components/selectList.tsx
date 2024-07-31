import React, { useState, useEffect } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';

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
    onChange?: (selected: SingleValue<OptionType> | MultiValue<OptionType>, name?: string, checked?: boolean) => void;
    name?: string;
}

const SelectList: React.FC<SelectListProps> = ({
    defaultOption,
    selectMultiple = false,
    options = [],
    onChange,
    name
}) => {
    const [selectedOption, setSelectedOption] = useState<SingleValue<OptionType> | MultiValue<OptionType>>(
        selectMultiple ? [] : null
    );
    const [isValueSelected, setIsValueSelected] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (selectMultiple) {
            setIsValueSelected(Array.isArray(selectedOption) && selectedOption.length > 0);
        } else {
            setIsValueSelected(selectedOption !== null);
        }
    }, [selectedOption, selectMultiple]);

    const handleChange = (selected: SingleValue<OptionType> | MultiValue<OptionType>) => {
        setSelectedOption(selected);
        if (onChange) {
            onChange(selected, name, isChecked);
        }
    };

    const handleCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
        if (onChange) {
            onChange(selectedOption, name, event.target.checked);
        }
    };

    return (
        <div className="p-4">
            {selectMultiple ? (
                // Rendu pour sélection multiple
                <>
                    <Select
                        name={name}
                        value={selectedOption as MultiValue<OptionType>}
                        onChange={handleChange}
                        options={options}
                        isMulti
                        placeholder={`Select ${defaultOption}`}
                    />
                </>
            ) : (
                // Rendu pour sélection unique
                <>
                    <Select
                        name={name}
                        value={selectedOption as SingleValue<OptionType>}
                        onChange={handleChange}
                        options={options}
                        placeholder={`Select ${defaultOption}`}
                    />
                    {isValueSelected && name === 'longDestination' && (
                        <div>
                            <label>
                                <input type="checkbox" checked={isChecked} onChange={handleCheckBox} />
                                Check if the destination has not been completed :(
                            </label>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SelectList;
