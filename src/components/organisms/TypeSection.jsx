import React from "react";
import Select from "react-select";
import { DEFAULT_FIELD_LABEL, DEFAULT_FIELD_VALUE } from "../../data";
import { getDocumentTypeNames } from "../../functions";
import styles from "../../index.css";
import { Tooltip } from "react-tippy";
import QuestionIcon from "../atoms/QuestionIcon";

class TypeSection extends React.Component {
  render() {
    const { documents, type, handleChange, handleFieldChange } = this.props;

    if (!documents) {
      return (
        <div className={styles.list}>
          <Spinner message="Loading..." center />
        </div>
      );
    }

    const types = getDocumentTypeNames();
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
          <div className={styles.flexEnd}>
            {showFields ? (
              <div className={styles.selectWrapper}>
                <Select
                  className={styles.fieldsSelect}
                  options={uniqueFields}
                  isSearchable
                  onChange={handleFieldChange}
                  defaultValue={{ value: DEFAULT_FIELD_VALUE, label: DEFAULT_FIELD_LABEL }}
                />
                <div>
                  <Tooltip
                    html={
                      <p style={{ margin: "0.75rem", maxWidth: "16rem" }}>
                        Use a custom field to order your attributes. Fields must be hidden and have
                        type "number" to be listed here.
                      </p>
                    }
                    position="right-start"
                    trigger="mouseenter"
                  >
                    <div className={styles.tooltip}>
                      <QuestionIcon />
                    </div>
                  </Tooltip>
                </div>
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
