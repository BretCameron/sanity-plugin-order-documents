import React, { useEffect, useCallback, useMemo, useRef, useState } from "react";
import styles from "../../index.css";
import { escapeStringRegExp, useOnClickOutside } from "../../functions";

export const Select = ({ options, onChange, value, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState({
    value,
    label,
  });

  const inputRef = useRef(null);
  const iconsRef = useRef(null);
  const listRef = useRef(null);

  const filteredOptions = useMemo(
    () =>
      options.filter(({ label, value }) => {
        const regex = new RegExp(escapeStringRegExp(search));
        return regex.test(label) || regex.test(value);
      }),
    [options, search]
  );

  const selectOption = useCallback(({ value, label }) => {
    setSelected({ value, label });
    setSearch(label);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  useEffect(() => {
    if (label && value) {
      selectOption({ label, value });
    }
  }, [label, value]);

  useOnClickOutside([inputRef, iconsRef, listRef], () => setIsOpen(false));

  return (
    <div className={styles.orderDocumentsSelectInputWrapper}>
      <input
        className={styles.orderDocumentsSelectInput}
        value={isOpen ? search : selected.label}
        placeholder="Select..."
        ref={inputRef}
        onFocus={() => {
          setIsOpen(true);
          setSearch("");
        }}
        onChange={(e) => {
          setIsOpen(true);
          setSearch(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            if (search) {
              setSearch("");
            } else {
              setIsOpen(false);
              inputRef.current.blur();
            }
          }
        }}
      />
      <div
        className={styles.orderDocumentsSelectIconsSection}
        ref={iconsRef}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            setIsOpen(true);
            inputRef.current.focus();
          }
        }}
      >
        <div
          className={styles.orderDocumentsArrowIconWrapper}
          onClick={() => {
            setIsOpen(true);
            setSearch("");
          }}
        >
          <svg width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
          </svg>
        </div>
        <span className={styles.orderDocumentsSelectIconsSeparator} />
        <div className={styles.orderDocumentsArrowIconWrapper}>
          <svg width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
          </svg>
        </div>
      </div>
      <ul
        ref={listRef}
        className={[
          styles.orderDocumentsSelectOptionsList,
          isOpen && filteredOptions.length ? styles.orderDocumentsSelectOptionsListOpen : "",
        ].join(" ")}
      >
        {isOpen &&
          filteredOptions.map(({ value, label }, index) => (
            <li
              className={[
                styles.orderDocumentsSelectOptionsListItem,
                index === 0 ? styles.orderDocumentsSelectOptionsListItemFirst : "",
                index === filteredOptions.length - 1
                  ? styles.orderDocumentsSelectOptionsListItemLast
                  : "",
                value === selected.value ? styles.orderDocumentsSelectOptionsListItemSelected : "",
              ].join(" ")}
              key={value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  selectOption({ value, label });
                }

                if (e.key === "Escape") {
                  inputRef.current.focus();
                }
              }}
              onClick={() => {
                selectOption({ value, label });
              }}
            >
              {label}
            </li>
          ))}
      </ul>
    </div>
  );
};
