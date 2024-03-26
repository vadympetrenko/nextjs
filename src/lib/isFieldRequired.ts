import {Maybe, AnyObject} from 'yup'

type isRequiredType = (params: { name: string; schema: Maybe<AnyObject>  }) => string | boolean;


export const isRequired:isRequiredType = ({name, schema}) => {
    return schema?.fields[name].spec.optional === false ? 'required' : false
}