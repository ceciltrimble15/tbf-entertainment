#!/usr/bin/perl
use strict;
use warnings;
use IO::Socket::INET;

my $root = 'C:/Users/Owner/Desktop/a1-creative-website';
my $port = $ENV{PORT} or die "PORT env variable not set\n";

my $server = IO::Socket::INET->new(
    LocalPort => $port,
    Type      => SOCK_STREAM,
    Reuse     => 1,
    Listen    => 10,
) or die "Cannot bind port $port: $!\n";

print "Serving http://localhost:$port\n";
$| = 1;

while (my $client = $server->accept()) {
    my $request = '';
    while (my $line = <$client>) {
        $request .= $line;
        last if $line =~ /^\r?\n$/;
    }

    my $path = '/';
    if ($request =~ /^GET\s+(\S+)/) {
        $path = $1;
        $path =~ s/\?.*//;
    }
    $path = '/standalone.html' if $path eq '/';
    $path =~ s|^/||;

    my $file = "$root/$path";
    my $mime = 'text/html; charset=utf-8';
    $mime = 'application/javascript' if $file =~ /\.js$/;
    $mime = 'text/css' if $file =~ /\.css$/;

    if (-f $file) {
        open my $fh, '<:raw', $file or do {
            print $client "HTTP/1.1 500 Error\r\nContent-Length: 5\r\n\r\nError";
            close $client; next;
        };
        local $/;
        my $body = <$fh>;
        close $fh;
        my $len = length($body);
        print $client "HTTP/1.1 200 OK\r\nContent-Type: $mime\r\nContent-Length: $len\r\nCache-Control: no-cache\r\n\r\n$body";
    } else {
        print $client "HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\n\r\nNot found";
    }
    close $client;
}
