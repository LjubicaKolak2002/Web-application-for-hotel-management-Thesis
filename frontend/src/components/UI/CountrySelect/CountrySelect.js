import React, { useEffect, useState } from "react";
import Select from "react-select";

const customSingleValue = ({ data }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <img
      src={`https://flagcdn.com/24x18/${data.code.toLowerCase()}.png`}
      alt={data.label}
    />
    {data.label}
  </div>
);

const customOption = (props) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{ display: "flex", alignItems: "center", padding: 6 }}
    >
      <img
        src={`https://flagcdn.com/24x18/${data.code.toLowerCase()}.png`}
        alt={data.label}
      />
      {data.label}
    </div>
  );
};

const CountrySelect = ({ onSelect }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem("countries");
    if (cached) {
      setCountries(JSON.parse(cached));
      return;
    }

    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .map((c) => ({
            label: c.name.common,
            code: c.cca2,
            value: c.cca2,
          }))
          .filter((c) => c.code)
          .sort((a, b) => a.label.localeCompare(b.label));

        setCountries(formatted);
        localStorage.setItem("countries", JSON.stringify(formatted));
      })
      .catch((err) => console.error("Error loading countries:", err));
  }, []);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 200, //fiksna sirina za cijelu komponentu
    }),
    input: (provided) => ({
      ...provided,
      width: 150, //fiksna sirina za input
    }),
    menu: (provided) => ({
      ...provided,
      width: 200, //fiksna sirina za padajuci izbornik
    }),
  };

  return (
    <div>
      <label>Country</label>
      <Select
        options={countries}
        onChange={(selected) =>
          onSelect({ name: selected.label, code: selected.code })
        }
        components={{ SingleValue: customSingleValue, Option: customOption }}
        placeholder="Select country..."
        styles={customStyles}
      />
    </div>
  );
};

export default CountrySelect;
