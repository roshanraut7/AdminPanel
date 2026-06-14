"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  FileText,
  ImagePlus,
  Link2,
  Lock,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  sampleCommunities,
  sampleDraftPosts,
  sampleMediaItems,
  sampleTagOptions,
  sampleVisibilityOptions,
  type AdminDraftPost,
  type PostTab,
  type PostTag,
  type PostVisibility,
  type SampleMediaItem,
} from "@/mocks/create-mock";

import {
  AdminRichTextEditor,
  type RichTextValue,
} from "@/components/text-editor/editor";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type StatusDialogState = {
  open: boolean;
  variant: "success" | "danger";
  title: string;
  message: string;
};

const normalCommunities = sampleCommunities.filter(
  (community) => community.purpose !== "DISTRICT_OFFICIAL",
);

const officialCommunity = sampleCommunities.find(
  (community) => community.purpose === "DISTRICT_OFFICIAL",
);

function getVisibilityIcon(visibility: PostVisibility) {
  if (visibility === "PUBLIC") return Sparkles;
  if (visibility === "COMMUNITY") return Users;
  return Lock;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const TAB_TRIGGER_CLASS =
  "rounded-md px-4 py-1.5 text-sm font-semibold text-muted-foreground transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm";

const CHIP_CLASS =
  "h-8 rounded-full border-border bg-background px-3 text-xs font-semibold";

export default function AdminCreatePostPage() {
  const [postTab, setPostTab] = useState<PostTab>("text");

  const [selectedCommunityId, setSelectedCommunityId] = useState(
    normalCommunities[0]?.id ?? "",
  );

  const [selectedTag, setSelectedTag] = useState<PostTag>("GENERAL");
  const [selectedVisibility, setSelectedVisibility] =
    useState<PostVisibility>("PUBLIC");

  const [title, setTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("<p></p>");
  const [editorValue, setEditorValue] = useState<RichTextValue>({
    html: "<p></p>",
    text: "",
    json: {},
  });

  const [linkUrl, setLinkUrl] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<SampleMediaItem[]>([]);

  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollClosesAt, setPollClosesAt] = useState("");

  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState(sampleDraftPosts);
  const [draftsOpen, setDraftsOpen] = useState(false);

  const [statusDialog, setStatusDialog] = useState<StatusDialogState>({
    open: false,
    variant: "success",
    title: "",
    message: "",
  });

  const selectedCommunity = useMemo(() => {
    return normalCommunities.find(
      (community) => community.id === selectedCommunityId,
    );
  }, [selectedCommunityId]);

  const targetCommunity = selectedCommunity ?? officialCommunity;

  const selectedTagMeta = sampleTagOptions.find(
    (tag) => tag.value === selectedTag,
  );

  const selectedVisibilityMeta = sampleVisibilityOptions.find(
    (visibility) => visibility.value === selectedVisibility,
  );

  const availableVisibilityOptions = useMemo(() => {
    if (selectedCommunity?.visibility === "PRIVATE") {
      return sampleVisibilityOptions.filter((item) => item.value !== "PUBLIC");
    }

    return sampleVisibilityOptions;
  }, [selectedCommunity?.visibility]);

  const VisibilityIcon = getVisibilityIcon(selectedVisibility);

  const titleRequired =
    postTab === "poll" ||
    ["ANNOUNCEMENT", "QUESTION", "OFFER", "EVENT", "NEWS"].includes(
      selectedTag,
    );

  useEffect(() => {
    if (
      selectedCommunity?.visibility === "PRIVATE" &&
      selectedVisibility === "PUBLIC"
    ) {
      setSelectedVisibility("COMMUNITY");
    }
  }, [selectedCommunity?.visibility, selectedVisibility]);

  const resetComposer = () => {
    setActiveDraftId(null);
    setPostTab("text");
    setSelectedTag("GENERAL");
    setSelectedVisibility("PUBLIC");
    setTitle("");
    setEditorHtml("<p></p>");
    setEditorValue({
      html: "<p></p>",
      text: "",
      json: {},
    });
    setLinkUrl("");
    setSelectedMedia([]);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setPollClosesAt("");
  };

  const showStatus = (
    variant: "success" | "danger",
    title: string,
    message: string,
  ) => {
    setStatusDialog({
      open: true,
      variant,
      title,
      message,
    });
  };

  const handleEditorChange = (value: RichTextValue) => {
    setEditorHtml(value.html);
    setEditorValue(value);
  };

  const handleOpenDraft = (draft: AdminDraftPost) => {
    setActiveDraftId(draft.id);
    setDraftsOpen(false);
    setPostTab(draft.postTab);
    setSelectedCommunityId(draft.communityId);
    setSelectedTag(draft.tag);
    setSelectedVisibility(draft.visibility);
    setTitle(draft.title);
    setEditorHtml(draft.contentHtml);
    setEditorValue({
      html: draft.contentHtml,
      text: stripHtml(draft.contentHtml),
      json: {},
    });
    setLinkUrl(draft.linkUrl ?? "");
  };

  const handleDeleteDraft = (draftId: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== draftId));

    if (activeDraftId === draftId) {
      resetComposer();
    }
  };

  const handleAddSampleMedia = () => {
    const unused = sampleMediaItems.find(
      (item) => !selectedMedia.some((media) => media.id === item.id),
    );

    if (!unused) {
      showStatus(
        "danger",
        "Media limit reached",
        "No more sample images are available.",
      );
      return;
    }

    setSelectedMedia((prev) => [...prev, unused]);
  };

  const handleSaveDraft = () => {
    const draftPayload = {
      communityId: targetCommunity?.id,
      title,
      tag: selectedTag,
      visibility: selectedVisibility,
      postTab,
      contentHtml: editorValue.html,
      contentText: editorValue.text,
      contentJson: editorValue.json,
      linkUrl: postTab === "link" ? linkUrl : "",
      media: postTab === "media" ? selectedMedia : [],
      poll:
        postTab === "poll"
          ? {
              question: pollQuestion,
              options: pollOptions,
              closesAt: pollClosesAt,
            }
          : undefined,
    };

    console.log("Sample draft payload:", draftPayload);

    showStatus(
      "success",
      "Draft saved",
      "This is only sample UI. Backend is not connected yet.",
    );
  };

  const handlePost = () => {
    if (!targetCommunity) {
      showStatus(
        "danger",
        "Community required",
        "Please select a community before posting.",
      );
      return;
    }

    if (titleRequired && !title.trim()) {
      showStatus(
        "danger",
        "Title required",
        "Please add a title for this type of post.",
      );
      return;
    }

    if (postTab === "poll") {
      const validOptions = pollOptions.filter((option) => option.trim());

      if (!pollQuestion.trim() || validOptions.length < 2) {
        showStatus(
          "danger",
          "Poll incomplete",
          "Please add a poll question and at least two options.",
        );
        return;
      }
    }

    const postPayload = {
      communityId: targetCommunity.id,
      title,
      tag: selectedTag,
      visibility: selectedVisibility,
      postTab,
      contentHtml: editorValue.html,
      contentText: editorValue.text,
      contentJson: editorValue.json,
      linkUrl: postTab === "link" ? linkUrl : "",
      media: postTab === "media" ? selectedMedia : [],
      poll:
        postTab === "poll"
          ? {
              question: pollQuestion,
              options: pollOptions.filter((option) => option.trim()),
              closesAt: pollClosesAt,
            }
          : undefined,
    };

    console.log("Sample post payload:", postPayload);

    showStatus(
      "success",
      "Post ready",
      `Sample post prepared for ${targetCommunity.name}. Backend is not connected yet.`,
    );

    resetComposer();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-muted"
          >
            <Link href="/admin/posts">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>

          <div>
            <h1 className="text-xl font-bold leading-tight text-foreground">
              {activeDraftId ? "Edit draft" : "Create post"}
            </h1>
            {activeDraftId ? (
              <p className="text-xs text-muted-foreground">Editing draft</p>
            ) : null}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="h-9 rounded-full px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => setDraftsOpen(true)}
        >
          <FileText className="mr-2 size-4" />
          Drafts
          {drafts.length > 0 ? (
            <span className="ml-1.5 flex size-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
              {drafts.length}
            </span>
          ) : null}
        </Button>
      </div>

      {/* Community selector */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5">
        <span className="text-sm font-medium text-muted-foreground">
          Posting to
        </span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 gap-2 rounded-full border border-border bg-background px-3 font-semibold hover:bg-muted"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {(targetCommunity?.name ?? "?").slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-[180px] truncate">
                {targetCommunity?.name ?? "Select community"}
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[320px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Search community..." />
              <CommandEmpty>No community found.</CommandEmpty>

              <CommandGroup>
                {normalCommunities.map((community) => (
                  <CommandItem
                    key={community.id}
                    value={community.name}
                    onSelect={() => setSelectedCommunityId(community.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="font-medium">{community.name}</span>

                      <span className="text-xs text-muted-foreground">
                        {community.memberCount.toLocaleString()} members ·{" "}
                        {community.visibility.toLowerCase()}
                      </span>
                    </div>

                    {selectedCommunityId === community.id ? (
                      <Check className="size-4 text-primary" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Composer */}
      <Card className="overflow-hidden rounded-xl border border-border bg-card shadow-none">
        <CardContent className="p-4">
          <Tabs
            value={postTab}
            onValueChange={(value) => setPostTab(value as PostTab)}
            className="w-full"
          >
            <TabsList className="h-auto w-full justify-start gap-1 rounded-lg bg-muted/60 p-1">
              <TabsTrigger value="text" className={TAB_TRIGGER_CLASS}>
                Text
              </TabsTrigger>
              <TabsTrigger value="media" className={TAB_TRIGGER_CLASS}>
                Images
              </TabsTrigger>
              <TabsTrigger value="link" className={TAB_TRIGGER_CLASS}>
                Link
              </TabsTrigger>
              <TabsTrigger value="poll" className={TAB_TRIGGER_CLASS}>
                Poll
              </TabsTrigger>
            </TabsList>

            {/* Tag / visibility chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className={CHIP_CLASS}>
                    <Tag className="mr-1.5 size-3.5 text-muted-foreground" />
                    {selectedTagMeta?.label ?? "Add tag"}
                    <ChevronDown className="ml-1.5 size-3.5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search tag..." />
                    <CommandEmpty>No tag found.</CommandEmpty>

                    <CommandGroup>
                      {sampleTagOptions.map((tag) => (
                        <CommandItem
                          key={tag.value}
                          value={tag.label}
                          onSelect={() => setSelectedTag(tag.value)}
                          className="cursor-pointer"
                        >
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="font-medium">{tag.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {tag.description}
                            </span>
                          </div>

                          {selectedTag === tag.value ? (
                            <Check className="size-4 text-primary" />
                          ) : null}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className={CHIP_CLASS}>
                    <VisibilityIcon className="mr-1.5 size-3.5 text-muted-foreground" />
                    {selectedVisibilityMeta?.label ?? "Visibility"}
                    <ChevronDown className="ml-1.5 size-3.5 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandGroup>
                      {availableVisibilityOptions.map((visibility) => {
                        const Icon = getVisibilityIcon(visibility.value);

                        return (
                          <CommandItem
                            key={visibility.value}
                            value={visibility.label}
                            onSelect={() =>
                              setSelectedVisibility(visibility.value)
                            }
                            className="cursor-pointer"
                          >
                            <Icon className="mr-3 size-4 text-muted-foreground" />

                            <div className="flex min-w-0 flex-1 flex-col">
                              <span className="font-medium">
                                {visibility.label}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {visibility.description}
                              </span>
                            </div>

                            {selectedVisibility === visibility.value ? (
                              <Check className="size-4 text-primary" />
                            ) : null}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedCommunity?.visibility === "PRIVATE" ? (
                <Badge
                  variant="outline"
                  className="rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs text-amber-700"
                >
                  Public disabled
                </Badge>
              ) : null}
            </div>

            {/* Title */}
            <div className="mt-4">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={titleRequired ? "Title (required)" : "Title (optional)"}
                className="h-12 rounded-lg border-0 border-b border-border bg-transparent px-1 text-lg font-medium shadow-none focus-visible:border-primary focus-visible:ring-0"
              />
            </div>

            <TabsContent value="text" className="mt-3">
              <AdminRichTextEditor
                value={editorHtml}
                onChange={handleEditorChange}
                placeholder="Share an update with your community..."
              />
            </TabsContent>

            <TabsContent value="media" className="mt-3 space-y-3">
              <AdminRichTextEditor
                value={editorHtml}
                onChange={handleEditorChange}
                placeholder="Write a caption for your images..."
              />

              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Images
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Sample upload area only. Backend upload is not connected.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={handleAddSampleMedia}
                  >
                    <ImagePlus className="mr-2 size-4" />
                    Add sample image
                  </Button>
                </div>

                {selectedMedia.length > 0 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {selectedMedia.map((media) => (
                      <div
                        key={media.id}
                        className="group overflow-hidden rounded-lg border border-border bg-background"
                      >
                        <div className="relative h-36 overflow-hidden bg-muted">
                          <Image
                            src={media.url}
                            alt={media.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 320px"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-3 p-3">
                          <p className="truncate text-sm font-medium">
                            {media.name}
                          </p>

                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 rounded-lg text-muted-foreground"
                            onClick={() =>
                              setSelectedMedia((prev) =>
                                prev.filter((item) => item.id !== media.id),
                              )
                            }
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex min-h-36 items-center justify-center rounded-lg border border-border bg-background">
                    <p className="text-sm text-muted-foreground">
                      No image selected yet.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="link" className="mt-3 space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Link URL
                </label>

                <div className="relative">
                  <Link2 className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={linkUrl}
                    onChange={(event) => setLinkUrl(event.target.value)}
                    placeholder="https://example.com"
                    className="h-12 rounded-lg border-border bg-background pl-11"
                  />
                </div>
              </div>

              <AdminRichTextEditor
                value={editorHtml}
                onChange={handleEditorChange}
                placeholder="Write something about this link..."
              />

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Link preview
                </p>

                <h3 className="mt-2 text-sm font-bold text-foreground">
                  {linkUrl || "Your link preview will appear here"}
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  This is a static preview block for UI testing only.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="poll" className="mt-3 space-y-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Poll question <span className="text-destructive">*</span>
                  </label>

                  <Input
                    value={pollQuestion}
                    onChange={(event) => setPollQuestion(event.target.value)}
                    placeholder="Ask your question"
                    className="h-12 rounded-lg bg-background"
                  />
                </div>

                <div className="mt-4 space-y-3">
                  <label className="text-sm font-semibold text-foreground">
                    Options <span className="text-destructive">*</span>
                  </label>

                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(event) => {
                          const next = [...pollOptions];
                          next[index] = event.target.value;
                          setPollOptions(next);
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="h-11 rounded-lg bg-background"
                      />

                      {pollOptions.length > 2 ? (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="size-10 rounded-lg text-muted-foreground"
                          onClick={() =>
                            setPollOptions((prev) =>
                              prev.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            )
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      ) : null}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setPollOptions((prev) => [...prev, ""])}
                  >
                    <Plus className="mr-2 size-4" />
                    Add option
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Close date{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>

                  <Input
                    type="datetime-local"
                    value={pollClosesAt}
                    onChange={(event) => setPollClosesAt(event.target.value)}
                    className="h-12 rounded-lg bg-background"
                  />
                </div>
              </div>

              <AdminRichTextEditor
                value={editorHtml}
                onChange={handleEditorChange}
                placeholder="Add more context for this poll..."
              />
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Footer actions */}
        <div className="flex flex-col gap-2 border-t border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-end">
          {activeDraftId ? (
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-full px-4 text-sm font-semibold"
              onClick={resetComposer}
            >
              New post
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            className="h-9 rounded-full px-4 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={handleSaveDraft}
          >
            Save draft
          </Button>

          <Button
            type="button"
            className="h-9 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            onClick={handlePost}
          >
            Post
          </Button>
        </div>
      </Card>

      {/* Drafts dialog */}
      <Dialog open={draftsOpen} onOpenChange={setDraftsOpen}>
        <DialogContent className="rounded-2xl sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Your drafts</DialogTitle>
            <DialogDescription>
              Open a draft to continue editing or delete drafts you no longer
              need.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[460px] pr-3">
            <div className="space-y-3">
              {drafts.length > 0 ? (
                drafts.map((draft) => {
                  const community = sampleCommunities.find(
                    (item) => item.id === draft.communityId,
                  );

                  return (
                    <div
                      key={draft.id}
                      className="rounded-xl border border-border bg-card p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-foreground">
                            {draft.title || "Untitled draft"}
                          </h3>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {community?.name ?? "Unknown community"} ·{" "}
                            {draft.updatedAt}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="outline" className="rounded-full">
                              {draft.tag}
                            </Badge>

                            <Badge variant="outline" className="rounded-full">
                              {draft.visibility}
                            </Badge>

                            <Badge variant="outline" className="rounded-full">
                              {draft.postTab}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleOpenDraft(draft)}
                          >
                            Open
                          </Button>

                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-9 rounded-lg text-muted-foreground"
                            onClick={() => handleDeleteDraft(draft.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">
                    No drafts available.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Status dialog */}
      <Dialog
        open={statusDialog.open}
        onOpenChange={(open) =>
          setStatusDialog((prev) => ({
            ...prev,
            open,
          }))
        }
      >
        <DialogContent className="rounded-2xl text-center sm:max-w-[420px]">
          <div
            className={`mx-auto flex size-14 items-center justify-center rounded-2xl ${
              statusDialog.variant === "success"
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {statusDialog.variant === "success" ? (
              <Check className="size-7" />
            ) : (
              <X className="size-7" />
            )}
          </div>

          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {statusDialog.title}
            </DialogTitle>

            <DialogDescription className="text-center leading-6">
              {statusDialog.message}
            </DialogDescription>
          </DialogHeader>

          <Button
            type="button"
            className="h-11 rounded-2xl"
            onClick={() =>
              setStatusDialog((prev) => ({
                ...prev,
                open: false,
              }))
            }
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}