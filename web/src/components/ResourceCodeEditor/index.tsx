import _ from 'lodash';
import { useCallback } from 'react';
import { CodeEditor } from 'web/src/components/CodeEditor';
import { ModalExpression } from 'web/src/components/ModalExpression';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';
import { useExpressionModal } from 'web/src/components/ResourceCodeEditor/hooks';
import { SourceQueryDebugModal } from 'web/src/components/SourceQueryDebugModal';
import { ReloadType } from 'web/src/containers/Main/types';

import { RemoteData } from 'aidbox-react/lib/libs/remoteData';

import { AidboxResource, Parameters, Questionnaire } from 'shared/src/contrib/aidbox';

interface ResourceCodeEditorProps<R> {
    resourceRD: RemoteData<R>;
    onSave: (resource: R) => void;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<AidboxResource>;
    fhirMode: boolean;
    reload: (type: ReloadType) => void;
}

export function ResourceCodeEditor<R extends AidboxResource>({
    resourceRD,
    onSave,
    launchContext,
    questionnaireResponseRD,
    fhirMode,
    reload,
}: ResourceCodeEditorProps<R>) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChange = useCallback(_.debounce(onSave, 1000), [onSave]);

    const { expressionModalInfo, closeExpressionModal, setExpression, openExpressionModal } =
        useExpressionModal();

    return (
        <>
            <RenderRemoteData remoteData={resourceRD}>
                {(resource) => (
                    <CodeEditor
                        key={resource.id}
                        valueObject={resource}
                        onChange={onChange}
                        openExpressionModal={openExpressionModal}
                        reload={reload}
                    />
                )}
            </RenderRemoteData>
            {expressionModalInfo &&
                (expressionModalInfo.type === 'SourceQueries' ? (
                    <RenderRemoteData remoteData={resourceRD}>
                        {(resource) => (
                            <SourceQueryDebugModal
                                sourceQueryId={expressionModalInfo?.expression || ''}
                                closeExpressionModal={closeExpressionModal}
                                launchContext={launchContext}
                                resource={resource as any as Questionnaire}
                                fhirMode={fhirMode}
                            />
                        )}
                    </RenderRemoteData>
                ) : (
                    <ModalExpression
                        expressionModalInfo={expressionModalInfo}
                        launchContext={launchContext}
                        questionnaireResponseRD={questionnaireResponseRD}
                        closeExpressionModal={closeExpressionModal}
                        setExpression={setExpression}
                    />
                ))}
        </>
    );
}
