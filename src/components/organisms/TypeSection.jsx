import React from "react";
import Select from "react-select";
import { DEFAULT_FIELD_LABEL, DEFAULT_FIELD_VALUE } from "../../data";
import styles from "../../index.css";
import { Tooltip } from "react-tippy";
import QuestionIcon from "../atoms/QuestionIcon";
import RefreshIcon from "../atoms/RefreshIcon";

class TypeSection extends React.Component {
  render() {
    const {
      documents,
      type,
      types,
      fields,
      handleTypeChange,
      handleFieldChange,
      refreshTypes,
    } = this.props;

    if (!documents) {
      return (
        <div className={styles.list}>
          <Spinner message="Loading..." center />
        </div>
      );
    }

    const selectorTypes = types.map(({ name, title }) => ({
      value: name,
      label: title,
    }));

    const showFields =
      fields.length > 1 && fields.findIndex((field) => field.value === "order") !== -1;

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
                  options={fields}
                  isSearchable
                  onChange={handleFieldChange}
                  defaultValue={{ value: DEFAULT_FIELD_VALUE, label: DEFAULT_FIELD_LABEL }}
                />
                <div>
                  <Tooltip
                    html={
                      <p className={styles.tooltipText}>
                        Use a custom field to order your documents. Fields must be hidden and have
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
        <div className={styles.subheading}>
          <p>
            <strong>Step 1: Choose a Type</strong>
          </p>
          <button className={styles.refreshButton} onClick={refreshTypes}>
            <RefreshIcon title="Refresh Types" />
          </button>
        </div>
        <Select options={selectorTypes} isSearchable onChange={handleTypeChange} value={type} />
      </>
    );
  }
}

export default TypeSection;
