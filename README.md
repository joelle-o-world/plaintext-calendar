# Calendar TXT

Calendar TXT is a markdown/vimwiki/plain-text extension for scheduling calendar events.

## Syntax

The syntax is simple. Assign a time to any line in your text file using the `@` character, followed by a time.

For example,

```
Install Calendar TXT @6pm
```

You can use a dash `-` to specify an end time.

```
@9am-10 Read the newspaper
```

Using a tilde `~` you can add a duration.

```
Practice the trombone @1am for ~6h
```

If you assign a duration, but no start time, the event will be scheduled after the one before it.

```
@8:30am eat breakfast. ~30m
~15m do some work
take a ~4h nap
```
