import React from "react";
import Select from "react-select";
import { DEFAULT_FIELD_LABEL, DEFAULT_FIELD_VALUE } from "../../data";
import { getDocumentTypeNames } from "../../functions";
import styles from "../../index.css";

class TypeSection extends React.Component {
  render() {
    const { documents, type, field, fields, handleChange, handleFieldChange } = this.props;

    if (!documents) {
      return (
        <div className={styles.list}>
          <Spinner message="Loading..." center />
        </div>
      );
    }

    const types = getDocumentTypeNames(field);
    const uniqueTypes = types.map(({ name, title }) => ({
      value: name,
      label: title
    }));

    const chosenType = types.find(({ name }) => name === type.value);

    const uniqueFields = (chosenType ? chosenType.fields : []).map(({ name, title }) => ({
      value: name,
      label: title
    }));

    const showFields =
      uniqueFields.length > 1 && uniqueFields.findIndex(field => field.value === "order") !== -1;

    return (
      <>
        <div className={styles.flexSpaceBetween}>
          <div>
            <h2 className={styles.noTopMargin}>Order Documents</h2>
            <p>Order your documents via drag-and-drop.</p>
          </div>
          <div>
            {showFields ? (
              <div className={styles.fieldButton}>
                <Select
                  options={uniqueFields}
                  isSearchable
                  onChange={handleFieldChange}
                  defaultValue={{ value: DEFAULT_FIELD_VALUE, label: DEFAULT_FIELD_LABEL }}
                />
              </div>
            ) : null}
          </div>
        </div>
        <hr />
        <p>
          <strong>Step 1: Choose a Type</strong>
        </p>
        <Select options={uniqueTypes} isSearchable onChange={handleChange} value={type} />
      </>
    );
  }
}

export default TypeSection;
