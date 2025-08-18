import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";

const SingleValue = (props) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <img
          src={`https://flagcdn.com/24x18/${data.code.toLowerCase()}.png`}
          alt={data.label}
        />
        {data.label}
      </div>
    </components.SingleValue>
  );
};

const Option = (props) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <img
          src={`https://flagcdn.com/24x18/${data.code.toLowerCase()}.png`}
          alt={data.label}
        />
        {data.label}
      </div>
    </components.Option>
  );
};

const CountrySelect = ({ onSelect }) => {
  const [countries, setCountries] = useState([]);

  //dohvat i cache
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
    control: (base) => ({
      ...base,
      width: 360,
      minHeight: 50,
      alignItems: "center",
    }),
    menu: (base) => ({ ...base, width: 360 }),
    placeholder: (base) => ({ ...base, paddingLeft: 10 }),
  };

  return (
    <Select
      options={countries}
      onChange={(sel) => onSelect({ name: sel.label, code: sel.code })}
      components={{ SingleValue, Option }}
      placeholder="Select country..."
      styles={customStyles}
    />
  );
};

export default CountrySelect;
