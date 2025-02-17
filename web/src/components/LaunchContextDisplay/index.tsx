import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { ResourceCodeDisplay } from 'web/src/components/ResourceCodeDisplay';

import { success } from 'aidbox-react/lib/libs/remoteData';

import { Parameters } from 'shared/src/contrib/aidbox';

import s from './LaunchContextDisplay.module.scss';

interface LaunchContextDisplayProps {
    parameters: Parameters;
}

export function LaunchContextDisplay({ parameters }: LaunchContextDisplayProps) {
    const params = useMemo(
        () => parameters.parameter?.filter((p) => p.name !== 'Questionnaire') || [],
        [parameters.parameter],
    );
    const defaultName = params[0]?.name;
    const [activeTabName, setActiveTabName] = useState(defaultName);

    useEffect(() => {
        if (typeof activeTabName === 'undefined' || !_.find(params, { name: activeTabName })) {
            setActiveTabName(defaultName);
        }
    }, [defaultName, activeTabName, params]);
    const active = _.find(params, { name: activeTabName })?.resource;
    return (
        <>
            {params.length > 0 && (
                <Tab
                    params={params}
                    activeTabName={activeTabName}
                    setActiveTabName={setActiveTabName}
                />
            )}
            <ResourceCodeDisplay resourceResponse={success(active!)} />
        </>
    );
}

function Tab({ params, setActiveTabName, activeTabName }: any) {
    return (
        <div className={s.wrapper}>
            {params.map(({ name }: any) => (
                <button
                    type={'button'}
                    key={name}
                    onClick={() => {
                        setActiveTabName(name);
                    }}
                    className={name === activeTabName ? s.checked : s.item}
                >
                    {name}
                </button>
            ))}
        </div>
    );
}
