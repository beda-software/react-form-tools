import React from 'react';
import yup from 'yup';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import {
    Form,
    ValidationBox,
    Input,
    Radio,
    CheckBox,
    Submit
} from 'react-form-tools';

const NestedForm = React.createClass({
    displayName: 'NestedForm',

    mixins: [SchemaBranchMixin],

    schema: {
        form: {},
    },

    validationSchema: yup.object().shape({}),

    onSubmit(data) {
        console.log('NestedForm is submitted with valid data', data);
    },

    onInvalidSubmit(errors) {
        console.log('NestedForm is submitted with errors', errors);
    },

    render() {
        return (
            <Form
                style={{ border: '1px solid black', padding: 5, marginTop: 5, marginBottom: 5 }}
                cursor={this.cursors.form}
                validationSchema={this.validationSchema}
                onSubmit={this.onSubmit}
                onInvalidSubmit={this.onInvalidSubmit}>
                Nested form
                <div>
                    <span>Text Input</span>
                    <ValidationBox fieldPath="fieldTextInput">
                        <Input />
                    </ValidationBox>
                </div>

                <div>
                    <Submit>Submit</Submit>
                </div>
            </Form>
        );
    },
});

export default React.createClass({
    mixins: [SchemaBranchMixin],

    schema: {
        nestedForm: {},
        form: {},
        formState: {},
    },

    validationSchema: yup.object().shape({}),

    onSubmit(data) {
        console.log('Form is submitted with valid data', data);
    },

    onInvalidSubmit(errors) {
        console.log('Form is submitted with errors', errors);
    },

    render() {
        return (
            <Form
                cursor={this.cursors.form}
                formStateCursor={this.cursors.formState}
                validationSchema={this.validationSchema}
                onSubmit={this.onSubmit}
                onInvalidSubmit={this.onInvalidSubmit}>
                <div>
                    <span>Text Input</span>
                    <ValidationBox fieldPath="fieldTextInput">
                        <Input />
                    </ValidationBox>
                </div>
                <div>
                    <ValidationBox fieldPath="fieldTextAreaInput">
                        <Input type="textarea" />
                    </ValidationBox>
                </div>
                <div>
                    <ValidationBox fieldPath="fieldRadioInput">
                        <label>
                            <Radio value="1" />
                            1
                        </label>
                        <label>
                            <Radio value="2" />
                            2
                        </label>
                        <label>
                            <Radio value="3" />
                            3
                        </label>
                    </ValidationBox>
                </div>

                <div>
                    <ValidationBox fieldPath="fieldCheckBoxInput">
                        <CheckBox value={true} /> Agree
                    </ValidationBox>
                </div>

                <div>
                    <NestedForm tree={this.cursors.nestedForm} />
                </div>

                <div>
                    <Submit>Submit</Submit>
                </div>

                <div>
                    Form tree:
                    <pre>
                        {JSON.stringify(this.state.form, null, 4)}
                    </pre>
                </div>
                <div>
                    Form state:
                    <pre>
                        {JSON.stringify(this.state.formState, null, 4)}
                    </pre>
                </div>
            </Form>
        );
    },
});
