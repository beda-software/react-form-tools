import React from 'react';
import yup from 'yup';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import {Form, ValidationBox, Input, Submit} from 'react-form-tools';

export default React.createClass({
    mixins: [SchemaBranchMixin],

    schema: {
        form: {},
        formState: {},
    },

    validationSchema: yup.object().shape({

    }),

    render() {
        return (
            <Form
                cursor={this.cursors.form}
                formStateCursor={this.cursors.formState}
                validationSchema={this.validationSchema}>
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
                            <Input type="radio" value="1" />
                            1
                        </label>
                        <label>
                            <Input type="radio" value="2" />
                            2
                        </label>
                        <label>
                            <Input type="radio" value="3" />
                            3
                        </label>
                    </ValidationBox>
                </div>

                <div>
                    <ValidationBox fieldPath="fieldCheckBoxInput">
                        <Input type="checkbox" value={true} />
                    </ValidationBox>
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
