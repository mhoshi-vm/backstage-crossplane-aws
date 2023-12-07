export interface Ecs {
    name: string;
    resources: Resource[];
}

export interface Resource {
    kind: string;
    resources: ResourceStatus[];
}

export interface ResourceStatus {
    name: string;
    ready: string;
    synced: string;
    externalName: string;
}


export interface Condition {
    reason: string,
    status: string,
    type: string
}

export interface UpboundECSCrd {
    apiVersion: string,
    kind: string,
    metadata: {
        name: string,
        annotations: {
            "crossplane.io/external-name": string
        }
        labels: {
            "app.kubernetes.io/part-of": string
        }
    }

    status: {
        conditions: Condition[]
    }

}