"use client";

import {useEffect, useRef, useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {ArrowLeft, ArrowRight, Radio, Trash2} from "lucide-react";
import {Link} from "@/common/i18n/navigation";
import CrosStorage, {type CrosStorageEvent, type CrosStorageMonitor} from "@/common/lib/CrosStorage";
import {PASSPORT_ROOT} from "@/common/lib/Env";
import {StorageType} from "@/common/lib/protocol/CrosProtocol";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

const MAX_EVENTS = 300;
const TOKEN_STORAGE_KEY = "hello";

type EventEntry = { id: number; event: CrosStorageEvent };
type FrameStatus = "loading" | "waitingInit" | "ready" | "local" | "unavailable";
type RequestStatus = "idle" | "pending" | "waiting" | "success" | "error" | "timeout" | "cancelled";

export default function CrosStorageMonitorPage() {
    const t = useTranslations("example.CrosStorageMonitor");
    const locale = useLocale();
    const clientRef = useRef<CrosStorage | null>(null);
    const nextEventId = useRef(1);
    const [connection, setConnection] = useState(0);
    const [connected, setConnected] = useState(false);
    const [iframeSrc, setIframeSrc] = useState<string | null>(null);
    const [frameStatus, setFrameStatus] = useState<FrameStatus>("loading");
    const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");
    const [events, setEvents] = useState<EventEntry[]>([]);
    const [storage, setStorage] = useState(StorageType.AUTOMATIC);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [readCompleted, setReadCompleted] = useState(false);

    useEffect(() => {
        let active = true;
        let client: CrosStorage | null = null;
        let hasFrame = false;
        setFrameStatus("loading");
        setRequestStatus("idle");
        setIframeSrc(null);
        const monitor: CrosStorageMonitor = {
            onEvent(event) {
                console.log(JSON.stringify(event))
                if (!active) return;
                const entry = {id: nextEventId.current++, event};
                setEvents(previous => [entry, ...previous].slice(0, MAX_EVENTS));
                // 状态独立于事件列表保存，清空记录不会丢失当前状态。
                switch (event.type) {
                    case "iframe-created":
                    case "iframe-reused":
                        hasFrame = true;
                        setFrameStatus(event.loaded ? "ready" : "loading");
                        break;
                    case "iframe-load":
                        // INIT 可能先于原生 load 到达；load 本身不表示代理已就绪。
                        setFrameStatus(previous => previous === "ready" ? "ready" : "waitingInit");
                        break;
                    case "iframe-ready":
                        setFrameStatus("ready");
                        break;
                    case "request-created":
                    case "request-sent":
                        setRequestStatus("pending");
                        break;
                    case "request-waiting":
                        setRequestStatus("waiting");
                        break;
                    case "response-received":
                        setRequestStatus(event.error ? "error" : "success");
                        break;
                    case "storage-operation":
                        setRequestStatus("success");
                        break;
                    case "request-error":
                    case "storage-error":
                        setRequestStatus("error");
                        break;
                    case "request-timeout":
                        setRequestStatus("timeout");
                        break;
                    case "request-cancelled":
                        setRequestStatus("cancelled");
                        break;
                }
            },
        };

        try {
            // 构造时也会产生事件，因此在创建实例前准备好 monitor。
            client = CrosStorage.getCrosStorage(monitor);
            clientRef.current = client;
            setConnected(true);
            setError(null);
            if (hasFrame) {
                setIframeSrc(document.querySelector<HTMLIFrameElement>("#cros-storage-iframe")?.src ?? null);
            } else {
                setFrameStatus("local");
            }
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : String(cause));
            setConnected(false);
            setFrameStatus("unavailable");
        }

        return () => {
            active = false;
            if (clientRef.current === client) {
                clientRef.current = null;
                client?.destroy();
            }
        };
    }, [connection]);

    const disconnect = () => {
        const client = clientRef.current;
        clientRef.current = null;
        // 页面仍挂载时保留取消和 destroy 事件；共享 iframe 由组件自行管理。
        client?.destroy();
        setConnected(false);
        setPending(false);
        setReadCompleted(false);
    };

    const readToken = async () => {
        const client = clientRef.current;
        if (!client || pending) return;
        setPending(true);
        setError(null);
        setReadCompleted(false);
        try {
            await client.get(TOKEN_STORAGE_KEY, storage);
            if (clientRef.current === client) setReadCompleted(true);
        } catch (cause) {
            if (clientRef.current === client) {
                setError(cause instanceof Error ? cause.message : String(cause));
            }
        } finally {
            if (clientRef.current === client) setPending(false);
        }
    };

    const disabled = !connected || pending;

    return (
        <main className="mx-auto min-h-screen max-w-7xl space-y-6 px-4 py-8 text-foreground sm:px-6 sm:py-12">
            <header>
                <nav aria-label={t("pageNavigation")} className="flex flex-wrap items-center justify-between gap-3">
                    <Link href="/"
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="size-4" aria-hidden="true"/>
                        {t("back")}
                    </Link>
                    {PASSPORT_ROOT && (
                        <a href={`${PASSPORT_ROOT.replace(/\/+$/, "")}/cros-storage-debug/`}
                           className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            {t("debugPage")}
                            <ArrowRight className="size-4" aria-hidden="true"/>
                        </a>
                    )}
                </nav>
                <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("title")}</h1>
                        <p className="mt-2 text-sm text-muted-foreground">{t("description")}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 text-sm" role="status">
                            <Radio
                                className={`size-4 ${connected ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                                aria-hidden="true"/>
                            {t(connected ? "connected" : "disconnected")}
                        </span>
                        <Button variant="outline" onClick={() => {
                            setReadCompleted(false);
                            setConnection(previous => previous + 1);
                        }} disabled={connected}>
                            {t("connect")}
                        </Button>
                        <Button variant="outline" onClick={disconnect} disabled={!connected}>
                            {t("disconnect")}
                        </Button>
                    </div>
                </div>
                <div className="mt-4 space-y-3 rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                    <div className="flex flex-wrap gap-2" role="status">
                        <span className="rounded-md border bg-background px-2 py-1">
                            {t("frameStatus")}: <span
                            className="font-medium text-foreground">{t(`frameStates.${frameStatus}`)}</span>
                        </span>
                        <span
                            className={`rounded-md border px-2 py-1 ${requestStatus === "error" || requestStatus === "timeout" ? "bg-destructive/10 text-destructive" : "bg-background"}`}>
                            {t("requestStatus")}: <span
                            className="font-medium">{t(`requestStates.${requestStatus}`)}</span>
                        </span>
                    </div>
                    {(iframeSrc || frameStatus === "local") && (
                        <p className="break-all">
                            <span className="font-medium">{t("iframe")}: </span>
                            {iframeSrc ? <code>{iframeSrc}</code> : t("localMode")}
                        </p>
                    )}
                    {iframeSrc && (
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <a href="#cros-storage-iframe"
                               className="font-medium text-foreground underline underline-offset-4">{t("viewIframe")}</a>
                            <span>{t("iframeBelow")}</span>
                        </p>
                    )}
                    {!connected && iframeSrc && <p>{t("monitorStoppedHint")}</p>}
                </div>
            </header>

            <section aria-labelledby="storage-operations" className="rounded-xl border bg-card p-4 sm:p-6">
                <h2 id="storage-operations" className="font-semibold">{t("operationsTitle")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("operationsDescription", {key: TOKEN_STORAGE_KEY})}</p>
                <div className="mt-5 space-y-2 sm:max-w-sm">
                    <Label htmlFor="storage-type">{t("storage")}</Label>
                    <select id="storage-type" value={storage}
                            onChange={event => setStorage(event.target.value as StorageType)}
                            disabled={pending}
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-2 focus-visible:outline-ring">
                        <option value={StorageType.AUTOMATIC}>{t("automatic")}</option>
                        <option value={StorageType.LOCAL}>localStorage</option>
                        <option value={StorageType.SESSION}>sessionStorage</option>
                    </select>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button onClick={() => void readToken()} disabled={disabled}>{t("read")}</Button>
                    <span className="text-sm text-muted-foreground" role="status">
                        {pending ? t("pending") : readCompleted ? t("operationSuccess") : null}
                    </span>
                </div>
                {error !== null && <p role="alert"
                                      className="mt-4 break-words rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error || t("errorFallback")}</p>}
            </section>

            <section aria-labelledby="storage-events" className="overflow-hidden rounded-xl border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4 sm:px-6">
                    <div>
                        <h2 id="storage-events" className="font-semibold">{t("eventsTitle")} <span
                            className="ml-2 font-mono text-sm text-muted-foreground">{events.length}</span></h2>
                        <p className="mt-1 text-xs text-muted-foreground">{t("eventsDescription", {limit: MAX_EVENTS})}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setEvents([])} disabled={!events.length}>
                        <Trash2 className="size-4" aria-hidden="true"/>{t("clear")}
                    </Button>
                </div>
                {!events.length ? (
                    <p className="p-10 text-center text-sm text-muted-foreground">{t("empty")}</p>
                ) : (
                    <div className="max-h-[65vh] overflow-auto">
                        <table className="w-full min-w-[760px] text-left text-xs">
                            <thead className="sticky top-0 z-10 bg-muted text-muted-foreground">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-medium">{t("time")}</th>
                                <th scope="col" className="px-4 py-3 font-medium">{t("event")}</th>
                                <th scope="col" className="px-4 py-3 font-medium">{t("request")}</th>
                                <th scope="col" className="px-4 py-3 font-medium">{t("details")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {events.map(({id, event}) => {
                                const failed = !!event.error || event.type === "request-error" || event.type === "storage-error" || event.type === "request-timeout";
                                return (
                                    <tr key={id} className={`border-t align-top ${failed ? "bg-destructive/5" : ""}`}>
                                        <td className="whitespace-nowrap px-4 py-3 font-mono">
                                            <time dateTime={new Date(event.timestamp).toISOString()}>
                                                {new Date(event.timestamp).toLocaleTimeString(locale === "zh" ? "zh-CN" : "en-GB", {hour12: false})}
                                                .{String(event.timestamp % 1000).padStart(3, "0")}
                                            </time>
                                            <div className="mt-1 text-muted-foreground">#{id}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <code
                                                className={`whitespace-nowrap rounded-md px-2 py-1 ${failed ? "bg-destructive/10 text-destructive" : "bg-muted"}`}>{event.type}</code>
                                        </td>
                                        <td className="max-w-64 space-y-1 break-all px-4 py-3 font-mono">
                                            <div>{event.command ?? "—"}{event.storage && ` · ${event.storage}`}</div>
                                            {event.key !== undefined &&
                                                <div><span className="text-muted-foreground">key: </span>{event.key}
                                                </div>}
                                            {event.value !== undefined && <div><span
                                                className="text-muted-foreground">{t("eventValue")}: </span><code>{JSON.stringify(event.value)}</code>
                                            </div>}
                                            {event.requestId && <div><span
                                                className="text-muted-foreground">{t("requestId")}: </span>{event.requestId}
                                            </div>}
                                        </td>
                                        <td className="max-w-lg space-y-1 break-all px-4 py-3">
                                            <div><span
                                                className="text-muted-foreground">{t("mode")}: </span>{t(event.crossOrigin ? "crossOrigin" : "sameOrigin")}
                                            </div>
                                            <div><span
                                                className="text-muted-foreground">{t("origin")}: </span><code>{event.iframeOrigin || "—"}</code>
                                            </div>
                                            {event.loaded !== undefined &&
                                                <div>{t("loaded")}: {t(event.loaded ? "yes" : "no")}</div>}
                                            {event.error && <p className="text-destructive">{event.error}</p>}
                                            <details className="pt-1">
                                                <summary
                                                    className="cursor-pointer text-muted-foreground">{t("rawEvent")}</summary>
                                                <pre
                                                    className="mt-2 max-w-lg overflow-auto whitespace-pre-wrap break-all rounded-md bg-muted p-3 font-mono">{JSON.stringify(event, null, 2)}</pre>
                                            </details>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}
