import React from "react";
import { Select } from "../molecules/Select";
import styles from "../../index.css";
import { Tooltip } from "react-tippy";
import QuestionIcon from "../atoms/QuestionIcon";
import RefreshIcon from "../atoms/RefreshIcon";

class TypeSection extends React.Component {
  render() {
    const { documents, type, types, fields, handleTypeChange, handleFieldChange, refreshTypes } =
      this.props;

    if (!documents) {
      return (
        <div className={styles.orderDocumentsList}>
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
        <div className={styles.orderDocumentsFlexSpaceBetween}>
          <div>
            <h2 className={styles.orderDocumentsNoTopMargin}>Order Documents</h2>
            <p>Order your documents via drag-and-drop.</p>
          </div>
          <div className={styles.orderDocumentsFlexEnd}>
            {showFields ? (
              <div className={styles.orderDocumentsSelectWrapper}>
                <Select
                  className={styles.orderDocumentsFieldsSelect}
                  options={fields}
                  isSearchable
                  onChange={({ value, label }) => {
                    handleFieldChange({ value, label });
                  }}
                />
                <div>
                  <Tooltip
                    html={
                      <p className={styles.orderDocumentsTooltipText}>
                        Use a custom field to order your documents. Fields must be hidden and have
                        type "number" to be listed here.
                      </p>
                    }
                    position="right-start"
                    trigger="mouseenter"
                  >
                    <div className={styles.orderDocumentsTooltip}>
                      <QuestionIcon />
                    </div>
                  </Tooltip>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <hr className={styles.orderDocumentsHr} />
        <div className={styles.orderDocumentsSubheading}>
          <p>
            <strong>Step 1: Choose a Type</strong>
          </p>
          <button className={styles.orderDocumentsRefreshButton} onClick={refreshTypes}>
            <RefreshIcon title="Refresh Types" />
          </button>
        </div>
        <Select
          value={type.value}
          options={selectorTypes}
          onChange={({ value, label }) => {
            handleTypeChange({ value, label });
          }}
        />
      </>
    );
  }
}

export default TypeSection;
